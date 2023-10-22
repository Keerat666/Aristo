import ForgeUI, {
  render,
  Fragment,
  Text,
  useState,
  Select,
  Option,
  Form,
  useProductContext
} from "@forge/ui";
import api, { route } from "@forge/api";
import PrModal from "./modal";



const fetchRepository = async (workspaceId, repositoryId) => {
  console.log("I was called")
  const res = await api
    .asApp()
    .requestBitbucket(route`/2.0/repositories/${workspaceId}/${repositoryId}`);

  const data = await res.json();
  console.log(data)

  return data;
};



const App = () => {
  const [formState, setFormState] = useState(undefined);
  const [modalState, setModalState] = useState(false);
  const [status,setStatus]=useState("Init")
  const context = useProductContext();
  const [repository] = useState(
    async () =>
      await fetchRepository(
        context.workspaceId,
        context.extensionContext.repository.uuid
      )
  );

  const fetchData = async () => {
    try {
      setStatus("Pre fetch for "+route`/2.0/repositories/${context.workspaceId}/${context.extensionContext.repository.uuid}/pullrequests`)  
      try{
        const response = await api.asApp().requestBitbucket(route`/2.0/repositories/${context.workspaceId}/${context.extensionContext.repository.uuid}/pullrequests`);
        setStatus("Post fetch")

        if (response.status === 200) {
          setStatus("200")
  
          const data = await response.json();
          console.log(data)
    
          const extractedData = data.values.slice(0, 15).map((pr) => {
            return {
              id: pr.id,
              title: pr.title,
              description: pr.description,
            };
          });
    
          
          return extractedData
        } else {
          console.log("Failed to fetch data as "+response.status);
        }
      } catch(error)
      {
        console.log(error)
      }
      

    } catch (error) {
      console.error("Error fetching PRs:", error);
    }
  };

  const [prList, setPrList] = useState(async () => await fetchData()); // State for PR list


  const onSubmit = async (formData) => {
    setModalState(false);
    setFormState(formData);
    setModalState(true);
  };

  return (
    <Fragment>
      <Text>Hello, I am Aristo!</Text>
      <Text>Please choose a PR request that you want me to review!</Text>
      <Form onSubmit={onSubmit}>
  {prList &&
    <Select label="Select a PR" name="PrListDropdown">
      {prList.map((pr) => (
        <Option
          key={pr} // Set a unique identifier as the key
          label={pr.title}
          value={pr} // Set a unique identifier as the value
        />
      ))}
    </Select>
  }
</Form>

      {modalState && <PrModal modal={modalState} pr={formState} workspaceId={context.workspaceId} repoId={context.extensionContext.repository.uuid} />}
    </Fragment>
  );
};

export const run = render(<App />);
