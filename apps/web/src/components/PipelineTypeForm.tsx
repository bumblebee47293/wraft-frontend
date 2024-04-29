import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Box, Flex, Button, Text, Input } from 'theme-ui';
import { Label, Select } from 'theme-ui';

import StepsIndicator from '@wraft-ui/Form/StepsIndicator';

import { fetchAPI, postAPI, putAPI, deleteAPI } from '../utils/models';
import Field from './Field';
import { ArrowRightIcon } from '@wraft/icon';
import toast from 'react-hot-toast';

export interface IFieldItem {
  name: string;
  type: string;
}

export interface FieldTypeItem {
  key: string;
  name?: string;
  field_type_id: string;
}

export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IField {
  id: string;
  name: string;
  layout_id: string;
  layout: ILayout;
  description: string;
}

interface Props {
  step?: number;
  setIsOpen?: (e: any) => void;
  pipelineData?: any;
  setRerender: any;
}

const Form = ({ step = 0, setIsOpen, pipelineData, setRerender }: Props) => {
  const [formStep, setFormStep] = useState(step);
  const [source, setSource] = useState<any>(['Wraft Form', 'CSV']);
  const [loading, setLoading] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Array<IField>>([]);
  const [forms, setForms] = useState<any>([]);
  const [formField, setFormField] = useState<Array<any>>([]);
  const [tempField, setTempField] = useState<Array<any>>([]);
  const [ctemplate, setCTemplate] = useState<any>();
  const [formId, setFormId] = useState<any>();
  const [pipeStageDetails, setPipeStageDetails] = useState<any>();

  const [destinationData, setDestinationData] = useState<any>([]);

  console.log(pipelineData, 'logpipeda');

  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const cId: string = router.query.id as string;

  const isUpdate = cId ? true : false;

  const loadTemplate = () => {
    fetchAPI(`data_templates`)
      .then((data: any) => {
        setLoading(true);
        const res: IField[] = data.data_templates;
        setTemplates(res);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  const loadForm = () => {
    fetchAPI(`forms`)
      .then((data: any) => {
        setLoading(true);
        const res: any = data.forms;
        setForms(res);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  //Pipeline Create API

  const createpipeline = (data: any) => {
    const sampleD = {
      name: data.pipelinename,
      api_route: 'client.crm.com',
      source_id: data.pipeline_form,
      source: data.pipeline_source,
    };
    console.log(sampleD, 'logsamp');

    postAPI(`pipelines`, sampleD).then((data) => {
      console.log(data, 'logdatacreatepipeline');
      setIsOpen && setIsOpen(false);
      toast.success('Saved Successfully', {
        duration: 1000,
        position: 'top-right',
      });
      setRerender((pre: boolean) => !pre);
    });
  };

  // Pipeline Stage create Api
  // calls when the next button is clicked

  function next() {
    setFormStep((i) => i + 1);
    if (formStep == 0) {
      const sampleD = {
        data_template_id: ctemplate.data_template.id,
        content_type_id: ctemplate.content_type.id,
      };
      postAPI(`pipelines/${cId}/stages`, sampleD)
        .then((res: any) => {
          console.log(res, 'logpipestage');

          setPipeStageDetails(res);
          toast.success('Stage Created Successfully', {
            duration: 1000,
            position: 'top-right',
          });
        })
        .catch(() => {
          setLoading(true);
        });
    }
  }

  // Pipeline mapping api

  const onSubmit = () => {
    const sampleD = {
      pipe_stage_id: pipeStageDetails.id,
      mapping: destinationData,
    };
    postAPI(`forms/${formId}/mapping`, sampleD).then((data: any) => {
      setIsOpen && setIsOpen(false);
      setRerender((prev: boolean)=> !prev)
      toast.success('Mapped Successfully', {
        duration: 1000,
        position: 'top-right',
      });
    });
  };

  const loadContentTypeSuccess = (data: any) => {
    const res = data.fields;
    setFormField(res);
  };

  const loadContentType = (id: string) => {
    fetchAPI(`forms/${id}`).then((data: any) => {
      loadContentTypeSuccess(data);
    });
  };

  const ctypeChange = () => {
    if (pipelineData) {
      setFormId(pipelineData.source_id);
      loadContentType(pipelineData.source_id);
    }
  };

  const loadTempTypeSuccess = (data: any) => {
    setCTemplate(data);
    const res = data.content_type.fields;
    setTempField(res);
  };

  const loadTempType = (id: string) => {
    fetchAPI(`data_templates/${id}`).then((data: any) => {
      loadTempTypeSuccess(data);
    });
  };

  const tempChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const safeSearchTypeValue: string = event.currentTarget.value;
    loadTempType(safeSearchTypeValue);
  };

  useEffect(() => {
    loadTemplate();
    loadForm();
    ctypeChange();
  }, []);

  function prev() {
    setFormStep((i) => i - 1);
  }

  const goTo = (step: number) => {
    setFormStep(step);
  };

  const titles = pipelineData ? ['Configure', 'Mapping'] : ['Details'];
  // const titles = ['Details', 'Configure', 'Mapping'];

  // function to organise the values which needed to for pipeline mappping

  const handleSelectChange = (index: any, selectedOption: any) => {
    const selectedDestination = tempField.find((m) => m.id === selectedOption);
    if (selectedDestination) {
      setDestinationData((prevData: any) => {
        const newData = [...prevData];
        newData[index] = {
          source: {
            source_id: formField[index].id,
            name: formField[index].name,
          },
          destination: {
            destination_id: selectedDestination.id,
            E_name: selectedDestination.name,
          },
        };
        return newData;
      });
    }
  };

  return (
    <Flex
      sx={{
        height: '100vh',
        overflow: 'scroll',
        flexDirection: 'column',
      }}>
      <Text
        variant="pB"
        sx={{
          p: 4,
        }}>
        Create Pipeline
      </Text>
      <StepsIndicator titles={titles} formStep={formStep} goTo={goTo} />
      <Box
        sx={{ height: '100%' }}
        p={4}
        as="form"
        onSubmit={handleSubmit(onSubmit)}>
        <Flex
          sx={{
            flexDirection: 'column',
            height: 'calc(100% - 80px)',
            overflowY: 'auto',
          }}>
          <Box sx={{ flexGrow: 1 }}>
            {!pipelineData && (
              <Box sx={{ display: formStep === 0 ? 'block' : 'none' }}>
                <Field
                  register={register}
                  label="Name"
                  name="pipelinename"
                  defaultValue={pipelineData ? pipelineData.name : ''}
                  placeholder="Pipeline Name"
                />
                <Box mt={3}>
                  <Label htmlFor="pipeline_source">Source</Label>
                  <Select
                    id="pipeline_source"
                    {...register('pipeline_source', { required: true })}>
                    {source &&
                      source.length > 0 &&
                      source.map((m: any) => (
                        <option value={m} key={m}>
                          {m}
                        </option>
                      ))}
                  </Select>
                </Box>
                <Box mt={3}>
                  <Label htmlFor="pipeline_form">Choose Form</Label>
                  <Select
                    id="pipeline_form"
                    {...register('pipeline_form', { required: true })}>
                    {!isUpdate && (
                      <option disabled selected>
                        select an option
                      </option>
                    )}
                    {forms &&
                      forms.length > 0 &&
                      forms.map((m: any) => (
                        <option value={m.id} key={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </Select>
                </Box>
              </Box>
            )}
            {pipelineData && (
              <Box sx={{ display: formStep === 0 ? 'block' : 'none' }}>
                <Box sx={{ display: 'none' }}>
                  <Input
                    id="edit"
                    defaultValue={0}
                    hidden={true}
                    {...register('edit', { required: true })}
                  />
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Label htmlFor="template_id">Choose a template</Label>
                  <Select
                    id="template_id"
                    {...register('template_id', { required: true })}
                    onChange={(e) => tempChange(e)}>
                    {!isUpdate && (
                      <option disabled selected>
                        select an option
                      </option>
                    )}
                    {templates &&
                      templates.length > 0 &&
                      templates.map((m: any) => (
                        <option value={m.id} key={m.id}>
                          {m.title}
                        </option>
                      ))}
                  </Select>
                </Box>
              </Box>
            )}
            {pipelineData && (
              <Box sx={{ display: formStep === 1 ? 'block' : 'none' }}>
                <Box>
                  <Label>Field Name</Label>
                  {formField.map((field, index) => (
                    <Box key={field.id}>
                      <Flex sx={{ alignItems: 'center', pb: '2' }}>
                        <Box sx={{ mr: 2 }}>
                          <Field
                            name={`fields.${index}.name`}
                            register={register}
                            defaultValue={(field && field.name) || ''}
                          />
                        </Box>
                        <ArrowRightIcon />
                        <Box sx={{ flexGrow: 1, ml: 2 }}>
                          <Select
                            {...register(
                              `fields.${index}.destination` as const,
                              {
                                required: true,
                              },
                            )}
                            onChange={(e) =>
                              handleSelectChange(index, e.target.value)
                            }
                            // onChange={() => handleSubmit(onSubmit)()}
                          >
                            <option disabled selected value={''}>
                              select an option
                            </option>
                            {tempField &&
                              tempField.length > 0 &&
                              tempField.map((m: any) => (
                                <option value={m.id} key={m.id}>
                                  {m.name}
                                </option>
                              ))}
                          </Select>
                        </Box>
                      </Flex>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Flex>

        <Flex mt={'auto'} pt={4} sx={{ justifyContent: 'space-between' }}>
          <Flex>
            {pipelineData && (
              <Flex>
                <Button
                  sx={{
                    display: formStep >= 1 ? 'block' : 'none',
                  }}
                  variant="buttonSecondary"
                  type="button"
                  onClick={prev}>
                  Prev
                </Button>
                <Button
                  ml={2}
                  sx={{
                    display: formStep >= 1 ? 'block' : 'none',
                  }}
                  variant="buttonPrimary"
                  type="submit">
                  Add
                </Button>
              </Flex>
            )}
            <Button
              ml={2}
              sx={{
                display: formStep == 0 ? 'block' : 'none',
              }}
              type="button"
              onClick={pipelineData ? next : handleSubmit(createpipeline)}
              variant="buttonPrimary">
              {pipelineData ? 'Next' : 'Create'}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
export default Form;
