import fetch from 'node-fetch';


export async function POST(requestEvent){
try {
    const requestJSON = await requestEvent.request.json();
    console.log("makeRequest called")
	const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const request = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestJSON)
    };
    console.log("request",request)
    let endpoint = "https://script.google.com/macros/s/AKfycbyrW3lRoa3dRmKZS35kWPeeMA1GBAGWApJiCuAaCP1k0BmGSkeRKGObloMRT3zOt3w/exec?action=addUser"

	console.log("fetch request called")

	let response = await fetch(endpoint, request)
    console.log("response",response)
    return new Response("success", { status: 200 })
	
} catch (e) {
    return new Response('Something went wrong!', { status: 500 });
}
}