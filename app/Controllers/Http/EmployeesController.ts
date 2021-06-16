import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Employee from 'App/Models/Employee'
import * as yup from 'yup'

export default class EmployeesController {
  public async index({ response }: HttpContextContract) {
    try {
      const employees = await Employee.query()

      for (let i = 0; i < employees.length; i++) {
        await employees[i].load('validation')
      }

      return response.status(200).json({ error: false, data: employees })
    } catch (error) {
      return response.status(500).json({ error: true, data: error.message })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const { name, email, cpf, phone, skills } = request.body()

    const schema = yup.object().shape({
      name: yup.string().max(100).required(),
      email: yup.string().max(100).email().required(),
      cpf: yup.string().max(14).required(),
      phone: yup.string().max(15),
      skills: yup.array().min(1).max(3).required(),
    })

    try {
      schema.validateSync({ name, email, cpf, phone, skills }, { abortEarly: false })

      const employee = await Employee.create({
        name,
        email,
        cpf,
        phone,
        skills: JSON.stringify(skills),
      })

      return response.status(201).json({ error: false, data: employee })
    } catch (error) {
      return response.status(400).json({ error: true, data: error.errors })
    }
  }
}
