import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "./App.css";

function App() {

  const [data, setData] = useState(null);
  const [datacpy, setDatacpy] = useState(null);
  const [pageno, setPageno] = useState(1);
  const [maxPages, setMaxPages] = useState(null);
  const [deleteBucket, setDeleteBucket] = useState([]);
  const [alloption, setAlloption] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [updateIdx, setUpdateIdx] = useState(null);

  const onOpenModal = (id) => {
    setOpen(true);
    setUpdateIdx(id);
  };
  const onCloseModal = () => {
    setOpen(false);
    setName("");
    setEmail("");
    setRole("");
  };

  useEffect(() => {
    //setIsloading(true);
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setData(res);
        setDatacpy(res);
        setMaxPages(Math.ceil(res.length / 10));
      })
      .catch((error) => console.log(error));
  }, []);

  const onReset = () => {
    setData(datacpy);
  };

  const handleOneDelete = (id) => {
    setData(data.filter((value) => value.id !== id));
  };

  const handleBucketAddRem = (e, id) => {
    console.log(e.target.checked);

    if (!deleteBucket.includes(id)) {
      setDeleteBucket([...deleteBucket, id]);
    } else {
      setDeleteBucket(deleteBucket.filter((value) => value !== id));
    }
  };

  const handleMultipleDelete = () => {
    setData(
      data.filter((value) => {
        return !deleteBucket.includes(value.id);
      })
    );
    setDeleteBucket([]);
    setAlloption(false);
  };

  const handleAllDelete = (e) => {
    if (e.target.checked) {
      setAlloption(true);
      setDeleteBucket(
        data.map((value, index) => {
          if (index >= (pageno - 1) * 10 && index <= (pageno - 1) * 10 + 9) {
            return value.id;
          }
        })
      );
    } else {
      setAlloption(false);
      setDeleteBucket([]);
    }
  };

  const handleUpdateSubmit = () => {
    setData(
      data.map((value) => {
        if (value.id === updateIdx) {
          return {
            id: updateIdx,
            name: name,
            email: email,
            role: role,
          };
        } else {
          return value;
        }
      })
    );
    setOpen(false);
    setName("");
    setEmail("");
    setRole("");
  };

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setData(datacpy);
      setPageno(1);
      return;
    }
    setData(
      datacpy.filter((value) => {
        return (
          value.name.includes(e.target.value.toLowerCase()) ||
          value.email.includes(e.target.value.toLowerCase()) ||
          value.role.includes(e.target.value.toLowerCase())
        );
      })
    );
  };

  return (
    <div>
      <div className="container">
        <input
          placeholder="Search by name, email or role"
          onChange={(e) => handleSearch(e)}
        />

        <Modal open={open} onClose={onCloseModal} center>
          <h2>Enter Updated Details</h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              value={name}
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              className="updateinput"
            />
            <input
              value={email}
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              className="updateinput"
            />
            <input
              value={role}
              placeholder="Enter Role"
              onChange={(e) => setRole(e.target.value)}
              className="updateinput"
            />
          </div>
          <button className="submitBtn" onClick={handleUpdateSubmit}>
            Submit
          </button>
        </Modal>

        {(data === null || data.length === 0) && (
          <div className="error_message">
            Sorry, there is no data to display
          </div>
        )}

        {data && data.length > 0 && (
          <>
            <table>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={alloption}
                    onChange={(e) => handleAllDelete(e)}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>

              {data &&
                data.map((value, index) => {
                  if (
                    index >= (pageno - 1) * 10 &&
                    index <= (pageno - 1) * 10 + 9
                  ) {
                    return (
                      <tr
                        className={`${
                          deleteBucket.includes(value.id) ? "bg_gray" : ""
                        }`}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={deleteBucket.includes(value.id)}
                            onChange={(e) => handleBucketAddRem(e, value.id)}
                          />
                        </td>
                        <td>{value.name}</td>
                        <td>{value.email}</td>
                        <td>{value.role}</td>
                        <td>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 svgs"
                            width={20}
                            onClick={() => onOpenModal(value.id)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="red"
                            className="w-6 h-6 svgs"
                            width={20}
                            style={{ marginLeft: "10px" }}
                            onClick={() => handleOneDelete(value.id)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </td>
                      </tr>
                    );
                  }
                })}
            </table>

            <div className="options">
              <div>
                <button className="deleteSel" onClick={handleMultipleDelete}>
                  Delete Selected
                </button>
              </div>
              {pageno !== 1 && (
                <button onClick={() => setPageno(1)}> &lt;&lt;</button>
              )}
              {pageno === 1 && <button disabled> &lt;&lt;</button>}
              {pageno - 1 >= 1 && (
                <button onClick={() => setPageno(pageno - 1)}>&lt;</button>
              )}
              {pageno - 1 < 1 && <button disabled>&lt;</button>}

              {data && 1 <= Math.ceil(data.length / 10) && (
                <button
                  className={`${pageno === 1 ? "curr_btn" : null}`}
                  onClick={() => setPageno(1)}
                >
                  1
                </button>
              )}

              {data && 2 <= Math.ceil(data.length / 10) && (
                <button
                  className={`${pageno === 2 ? "curr_btn" : null}`}
                  onClick={() => setPageno(2)}
                >
                  2
                </button>
              )}

              {data && 3 <= Math.ceil(data.length / 10) && (
                <button
                  className={`${pageno === 3 ? "curr_btn" : null}`}
                  onClick={() => setPageno(3)}
                >
                  3
                </button>
              )}

              {data && 4 <= Math.ceil(data.length / 10) && (
                <button
                  className={`${pageno === 4 ? "curr_btn" : null}`}
                  onClick={() => setPageno(4)}
                >
                  4
                </button>
              )}

              {data && 5 <= Math.ceil(data.length / 10) && (
                <button
                  className={`${pageno === 5 ? "curr_btn" : null}`}
                  onClick={() => setPageno(5)}
                >
                  5
                </button>
              )}

              {pageno + 1 > maxPages && <button disabled>&gt;</button>}

              {pageno + 1 <= maxPages && (
                <button onClick={() => setPageno(pageno + 1)}>&gt;</button>
              )}

              {pageno === maxPages && <button disabled> &gt;&gt;</button>}

              {pageno !== maxPages && (
                <button onClick={() => setPageno(maxPages)}> &gt;&gt;</button>
              )}

              <div>
                <button className="reset" onClick={onReset}>
                  Reset
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
