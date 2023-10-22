import api, { route } from "@forge/api";

const test = async ()=>{

    const workspace = "aristo42";
    const repoSlug = "javascript-node-repo";
    setStatus("Pre fetch for ")
    const apiUrl = `/2.0/repositories/${workspace}/${repoSlug}/pullrequests`;

    const response = await api.asApp().requestBitbucket(route`${apiUrl}`);
    const data = await response.json();
    console.log(data)
}

test()