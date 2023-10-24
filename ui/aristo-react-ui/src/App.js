import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { useEffect } from 'react';

const App = () => {
  // Sample API response data (you should replace this with your API data)

  const [selectedItem, setSelectedItem] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]); // State to store dropdown options

  useEffect(() => {
    // Make an API request to fetch the dropdown options
    fetch('https://aristo-fzl2.onrender.com/api/fetchFiles')
      .then((response) => response.json())
      .then((data) => {
        setDropdownOptions(data.dropdown);
      })
      .catch((error) => {
        console.error('Error fetching dropdown options:', error);
      });
  }, []); // The empty dependency array ensures that this effect runs only once on component mount

  const fetchData = (selectedValue) => {
    // Simulating API call with a delay
    setSelectedItem(selectedValue);

    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("fileName", selectedValue);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};


fetch("https://aristo-fzl2.onrender.com/api/fetchContent", requestOptions)
  .then(response => response.text())
  .then(result => {
    const parsedResult = JSON.parse(result);
    console.log(parsedResult);
    setTableData(parsedResult.result)

  })
  .catch(error => console.log('error', error));
}



  return (
    <div className="container">
      <div className="text-center mt-4">
        <img src="/aristo.jpg" alt="Aristo Icon" className="rounded-circle" style={{ height: '100px', width: '100px' }} />
        <h1>Hello 👋 I am Aristo!</h1>
      </div>

      <h4 style={{ marginTop: '40px' }} >About me</h4>
      <p>
        I am an AI designed to streamline the code review process, by offering valuable feedback to enhance your pull requests. With a deep understanding of numerous programming languages, I continuously evolve to better serve your needs. Currently, I exclusively support pull requests within the Aristo42 workspace on Bitbucket. My creation was prompted by a submission to <a href="https://codegeistunleashed.devpost.com" target="_blank">Codegeist Unleashed 2023</a>, and I found my place within <strong>Bitbucket</strong> due to the remarkable capabilities of ForgeUI.
      </p>

      <h4>The purpose of this webpage</h4>
      <p>
      I'm designed to remember my feedback on every file I review for a PR. If you've used me for a PR and wish to revisit my insights for a file, simply select the corresponding entry from the dropdown, and I'll provide a summary of my thoughts on the specific file in that PR.      </p>

<p>To try out Aristo please mail me about your interest at <strong>gurkeeratsondhi@gmail.com</strong> and I would provide you access to a repo to take Aristo for a spin!</p>
      <Dropdown style={{ marginTop: '40px' }}>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {selectedItem ? `Entry ${selectedItem}` : 'Select a previously reviewed PR'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {dropdownOptions.map((option, index) => (
            <Dropdown.Item key={index} onClick={() => fetchData(option)}>
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
        </Dropdown>

      {tableData.length > 0 && (
        <table className="table mt-3">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Line</th>
              <th>Comment</th>
              <th>Suggestion for Fix</th>
              <th>Criticality</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(item => (
              <tr key={item.fileName}>
                <td>{item.fileName}</td>
                <td>{item.lineNumber}</td>
                <td>{item.comment}</td>
                <td>{item.solutionToFixThatComment}</td>
                <td style={{ color: item.category === 'High' ? '#d9534f' : item.category === 'Medium' ? '#f0ad4e' : '#5bc0de' }}>
  {item.category}
</td>              </tr>
            ))}
          </tbody>
        </table>
      )}

{/* <h4 style={{ marginTop: '40px' }} >Demo Video on Youtube</h4> */}

{/* <iframe style={{ marginTop: '20px' }} width="560" height="315" src="https://www.youtube.com/embed/8JvZFTL8rgM?si=Rm8781rutmAMsbsD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}


      <div className="row" style={{ marginTop: '40px' }}>
        <div className="col-md-6">
          <h4>Learn more about my story.</h4>
          <ol>
            <li><a rel="noopener" href="https://blog.openai.com/aristo" target="_blank">Medium Article about why I came into existence</a></li>
            <li><a rel="noopener" href="https://devpost.com/software/aristo-psat01" target="_blank">Devpost Project Page</a></li>
          </ol>
        </div>
        <div className="col-md-6">
          <h4>Created By</h4>
          <ol>
            <li><img src="/keerat.jpeg" alt="Aristo Icon" className="rounded-circle" style={{ height: '50px', width: '50px', marginRight: '10px' }} />
              Gurkeerat Singh Sondhi - <a style={{ marginLeft: '4px' }} rel="noopener" href="https://www.linkedin.com/in/gurkeerat-singh-7002b7131/" target="_blank">LinkedIn</a>   <a style={{ marginLeft: '2px' }} rel="noopener" href="https://github.com/Keerat666" target="_blank">Github</a>
            </li>
            <li style={{ marginTop: '15px' }}><img src="/jasleen.jpeg" alt="Aristo Icon" className="rounded-circle" style={{ height: '50px', width: '50px', marginRight: '10px' }} />
              Jasleen Kaur Sondhi - <a style={{ marginLeft: '4px' }} rel="noopener" href="https://www.linkedin.com/in/jasleensondhi/" target="_blank">LinkedIn</a>  <a style={{ marginLeft: '2px' }} rel="noopener" href="https://github.com/jasleen101010/" target="_blank">Github</a>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default App;
