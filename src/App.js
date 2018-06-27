import React from 'react';
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      commentdata: [],
      message: false,
      mydata: 0
    };
  }


  componentWillMount() {
    fetch("https://api.github.com/repos/facebook/react/pulls?access_token=010c76a49d3384ee23d5213e223c110aa2d8d52e")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({ data: result })
          if (!result.message)
            this.commentData();
        },
        (error) => {
          console.log("Api failed ===", error)
        }
      )
  }


  commentData() {

    var finaldata2 = [];
    this.state.data.map((value, index) => {
      fetch(value.comments_url + "?access_token=010c76a49d3384ee23d5213e223c110aa2d8d52e")
        .then(res => res.json())
        .then(
          (result) => {

            fetch(value.review_comments_url
              + "?access_token=010c76a49d3384ee23d5213e223c110aa2d8d52e")
              .then(res => res.json())
              .then(
                (result1) => {

                  finaldata2.push({ number: value.number, commentdata: result.concat(result1) });

                  this.state.data[index]['commentNo'] = (result.length + result1.length)
                  this.state.data[index]['commentReceived'] = true;
                  this.setState({ data: this.state.data });
                  if (this.state.data.every(entry => entry.commentReceived)) {
                    this.sortdata();
                  }
                },
                (error) => {
                  console.log("Api failed 2===", error)
                }
              )


          },
          (error) => {
            console.log("Api failed3 ===", error)
          }
        )
      this.setState({ commentdata: finaldata2 })
    })
  }



  sortdata = () => {
    let data = this.state.data.sort(function (a, b) {
      return b.commentNo - a.commentNo
    });
    this.setState({ data });
  }


  render() {
    if (this.state.message) {
      for (let commentdata of this.state.commentdata) {

        if (commentdata.number === this.state.mydata) {
          return (
            <div>

              <table>
                <thead>
                  <tr>

                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (commentdata.commentdata.message || commentdata.commentdata.length === 0) ?
                      <tr >

                        <td> No Comments Found</td>
                      </tr>
                      :
                      commentdata.commentdata.map((data) =>

                        <tr >

                          <td> <b>{data.user.login} : </b> {data.body}</td>
                        </tr>
                      )}
                </tbody>

              </table>
              <button
                style={{ marginLeft: "45%", marginBottom: "2%", width: "10%", marginTop: "2%" }}
                onClick={() => this.setState({ message: false })}> Back</button>

            </div>
          );
        }
      }
    }

    return (
      <div className="Pullrequest">
        <table>
          <thead>
            <tr>
              <th >Title</th>
              <th>User</th>
              <th>Status</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {(this.state.data.length < 1 || this.state.data.message) ? <tr><td colspan="4"> No data found </td></tr> :
              this.state.data.map((value) =>
                <tr onClick={() => this.setState({ message: true, mydata: value.number })}>
                  <td> {value.title}</td>
                  <td>{value.user.login} </td>
                  <td>{value.state} </td>
                  <td>{value.commentNo}</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>


    );
  }
}

export default App;


