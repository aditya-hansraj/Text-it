export const baseUrl = 'http://localhost:5000/api'

export const postRequest = async (url, body) => {
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': "application/json"
        },
        body
    })
    const data = await response.json();

    if(!response.ok) {
        let message = data?.message ? data.message : data;
        return { error: true, message };
    }

    return data;
};

export const getRequest = async url=> {
    const response = await fetch(url);
    const data = await response.json();

    if(!response.ok) {
        let message = data?.message ? data.message : data;
        return { error: true, message };
    }
    
    return data;

}