import { SiteClient } from 'datocms-client'

export default async function recebedorDeRequests(request, response) {

  if(request.method === 'POST') {
    const TOKEN = '9775663564dd93eddc77c4c46b5fb8'
    const client = new SiteClient(TOKEN)

    const registroCriado = await client.items.create({
      itemType: '967807',
      ...request.body,      
    })

    response.json({
      dados: 'Algum dado qualquer',
      registroCriado: registroCriado,
    })
    return;
  }
}