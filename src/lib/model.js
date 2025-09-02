const URL = import.meta.env.VITE_URL;

/**
 * @param {any} data
 */
export async function addDocument(data) {
    try {
        console.log(JSON.stringify({data}));
        const url = URL + "add-document";
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json'}, // Important to include the headers!
            body: JSON.stringify({data})
        });
        console.log(response);
        return {"status": 0}
    } catch (error) {
        console.log("failed to adddocument: " + error);
    }
}

/**
 * @param {any} collection
 */
export async function getDocuments(collection) {
  try {

    const toSend = {
      "collection": collection
    }

    let res = await fetch(URL + "read-collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({toSend})
    })
    res = await res.json();
    return res;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function getAllColls() {
    try {
        const url = URL + "get-colls";
        const response = await fetch(url);
        const allColls = await response.json();
        let result = [];
        for (let i = 0; i < allColls.length; i++) {
            const temp = {value: allColls[i], name: allColls[i]}
            result.push(temp);
        }
        return result;
    } catch (error) {
        console.log("failed to get all colls: " + error);
        return [];
    }
}

/**
 * @param {any} toSend
 */
export async function deleteDoc(toSend) {

  const url = URL + "delete-doc";

  const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json'}, // Important to include the headers!
      body: JSON.stringify(toSend)
  });

  const data = await response.json();
  console.log(data);
}