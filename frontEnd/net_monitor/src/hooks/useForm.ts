import { useState, useMemo, useEffect } from "react";
import { ZodType, ZodError } from "zod";

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  requiredFields: (keyof T)[] = [],
  schema?: ZodType<T>
) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  // Função para validar com Zod
  const validateZod = (data: T) => {
    if (!schema) return {};
    
    try {
      schema.parse(data);
      return {};
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        err.issues.forEach(issue => {
          const key = issue.path[0] as keyof T;
          fieldErrors[key] = issue.message;
        });
        return fieldErrors;
      }
    }
    return {};
  };

  // Validação reativa sempre que formData muda
  useEffect(() => {
    const newErrors = validateZod(formData);
    setErrors(newErrors);
  }, [formData, schema]);

  // Calcula se o formulário é válido
  const isValid = useMemo(() => {
    // Verifica se os campos obrigatórios estão preenchidos
    const requiredFilled = requiredFields.every(
      field =>
        formData[field] !== null &&
        formData[field] !== undefined &&
        String(formData[field]).trim() !== ""
    );
    
    // Verifica se não há erros de validação
    const noErrors = Object.keys(errors).length === 0;
    
    return requiredFilled && noErrors;
  }, [formData, errors, requiredFields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (!name) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const setDefault = () => {
    setFormData(initialValues);
    setErrors({});
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    handleSwitchChange,
    errors,
    isValid,
    setDefault,
  };
}