const { scrapper } = require("./scrapper");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    let requestData = {
        dni: '72417039',
        birthDate: '24091997', 
        emissionDate: '14032019'
    };
    console.log(req.body);
    if(req?.body?.dni) {
        requestData.dni = req.body.dni;
        requestData.birthDate = req.body.birthDate;
        requestData.emissionDate = req.body.emissionDate;
    }
    const data = await scrapper(requestData);
    if(!data) {
        context.res = {
            status: 500,
            body: {
                message: 'Error al recuperar los datos',
            },
            headers: {
                "Content-Type": "application/json"
            }
        }
    }else {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: data,
            headers: {
                "Content-Type": "application/json"
            }
        };
    }
    
}