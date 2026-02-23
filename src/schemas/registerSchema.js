import { z } from 'zod'

const today = new Date()
const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "ПІБ має містити щонайменше 2 символи")
    .max(100, "ПІБ занадто довге")
    .regex(/^[а-яіїєґА-ЯІЇЄҐA-Za-z\s'-]+$/, "ПІБ може містити лише літери"),

  email: z
    .string()
    .min(1, "Email обов'язковий")
    .email("Невірний формат Email"),

  birthDate: z
    .string()
    .min(1, "Дата народження обов'язкова")
    .refine(val => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, "Невірна дата")
    .refine(val => {
      const date = new Date(val)
      return date <= minBirthDate
    }, "Учасник має бути старше 18 років"),

  source: z
    .string()
    .min(1, "Оберіть джерело інформації"),
})