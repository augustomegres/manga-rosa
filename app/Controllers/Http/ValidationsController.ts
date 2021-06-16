import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validation from 'App/Models/Validation'
import * as yup from 'yup'

export default class ValidationsController {
  public async update({ request, response }: HttpContextContract) {
    const { isValid } = request.body()
    const { id } = request.params()
    const schema = yup.object({
      isValid: yup.boolean().required(),
    })

    try {
      schema.validateSync({ isValid })

      const validation = await Validation.find(id)
      await validation?.merge({ isValid })
      await validation?.save()

      return response.status(200).json({ error: true, data: isValid })
    } catch (error) {
      return response.status(400).json({ error: true, data: error.message })
    }
  }
}
