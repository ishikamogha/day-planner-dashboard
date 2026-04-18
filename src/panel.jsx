import {Routes,Route,useNavigate} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import {logout} from './store.js';
import Login from './login.jsx';
import Signup from './signup.jsx';
import {useState,useRef} from 'react';
import {useEffect} from 'react';
import './panel.css';

//main panel
function Panel(){
  //redux
  const dispatch=useDispatch();
  const navigate=useNavigate();

  //get email from store
  const userEmail=useSelector((state)=>state.auth.email);
  const isLoggedIn=useSelector((state)=>state.auth.isLoggedIn);

  //active tab
  const [active,setActive]=useState('task');
  //dropdown
  const [dropdownOpen,setDropdownOpen]=useState(false);

  //tasks
  const [tasks,setTasks]=useState([
      {id:1,title:'Buy groceries',desc:'Milk, bread, butter',done:false},
    {id:2,title:'Do workout',desc:'30 min walk',done:false},
        {id:3,title:'Study React',desc:'Hooks, Functional Components',done:false},
    {id:4,title:'Buy fruits',desc:'Apple, Mango, Orange',done:false},
      {id:5,title:'Buy new clothes',desc:'Shirts, Tops',done:false},
    {id:6,title:'Cook dinner',desc:'Try new recipe',done:false},
        {id:7,title:'Clean room',desc:'Organize desk',done:false},
  ]);

  //modal states
  const [showModal,setShowModal]=useState(false);
  const [editTask,setEditTask]=useState(null);
  const [titleInput,setTitleInput]=useState('');
  const [descInput,setDescInput]=useState('');
  const [titleError,setTitleError]=useState('');

  //pagination
  const [currentPage,setCurrentPage]=useState(1);
  const tasksPerPage=5;

  //drag refs
  const dragItem=useRef(null);
  const dragOverItem=useRef(null);

  //journal
  const editorRef=useRef(null);
  const [showSaved,setShowSaved]=useState(false);
  //load saved entries from localStorage
  const [savedEntries,setSavedEntries]=useState(()=>{
      const stored=localStorage.getItem('journalEntries');
      return stored?JSON.parse(stored):[];
  });

  //water
  const [glasses,setGlasses]=useState([false,false,false,false,false,false,false,false]);

  //budget
  const [income,setIncome]=useState('');
  const [expense,setExpense]=useState('');
  const [expenseDesc,setExpenseDesc]=useState('');
  const [expenses,setExpenses]=useState([]);

  //filter
  const [filter,setFilter]=useState('all');

  //profile - load from localStorage
  const [profileData,setProfileData]=useState(()=>{
    const saved=localStorage.getItem('profileData');
    if(saved){
      return JSON.parse(saved);
    }
    //default values
    return {name:'',age:'',bio:'',phone:'',city:'',email:userEmail,image:''};
  });
  //edit mode
  const [editProfile,setEditProfile]=useState(false);

  //save profile to localStorage whenever it changes
  useEffect(()=>{
    localStorage.setItem('profileData',JSON.stringify(profileData));
  },[profileData]);

  //warning state
  const [showWarning,setShowWarning]=useState(false);
  //saved toast
  const [savedMsg,setSavedMsg]=useState(false);

  //auto logout timer
  useEffect(()=>{
    if(isLoggedIn){
     
      const warningTimer=setTimeout(()=>{
          setShowWarning(true);
      },7*60*1000);
      
      const logoutTimer=setTimeout(()=>{
        setShowWarning(false);
          dispatch(logout());
          navigate('/');
      },10*60*1000);
     
      return ()=>{
        clearTimeout(warningTimer);
        clearTimeout(logoutTimer);
      };
    }
  },[isLoggedIn]);

  //sync email
  useEffect(()=>{
      setProfileData((prev)=>({...prev,email:userEmail}));
  },[userEmail]);

  //logout
  function handleLogout(){
    dispatch(logout());
      setDropdownOpen(false);
    navigate('/');
  }

  //open add modal
  const openAddModal=()=>{
      setEditTask(null);
    setTitleInput('');
    setDescInput('');
    setTitleError('');
      setShowModal(true);
  };

  //open edit modal
  const openEditModal=(task)=>{
    setEditTask(task);
      setTitleInput(task.title);
    setDescInput(task.desc);
      setTitleError('');
    setShowModal(true);
  };

  //save task
  const handleSaveTask=()=>{
    //validate
    if(!titleInput.trim()){
        setTitleError('Title is required!');
        return;
    }
    if(editTask){
      //edit existing
      setTasks(tasks.map(t=>t.id===editTask.id?{...t,title:titleInput,desc:descInput}:t));
    }else{
        //add new
        setTasks([...tasks,{id:Date.now(),title:titleInput,desc:descInput,done:false}]);
    }
    setShowModal(false);
    setCurrentPage(1);
  };

  //delete task
  const handleDeleteTask=(id)=>{
      setTasks(tasks.filter(t=>t.id!==id));
  };

  //toggle done
  const handleCheckTask=(id)=>{
    setTasks(tasks.map(t=>t.id===id?{...t,done:!t.done}:t));
  };

  //drag start
  const handleDragStart=(index)=>{
      dragItem.current=index;
  };

  //drag enter
  const handleDragEnter=(index)=>{
    dragOverItem.current=index;
  };

  //drag end - reorder
  const handleDragEnd=()=>{
    const updatedTasks=[...tasks];
      const dragged=updatedTasks.splice(dragItem.current,1)[0];
      updatedTasks.splice(dragOverItem.current,0,dragged);
    dragItem.current=null;
    dragOverItem.current=null;
      setTasks(updatedTasks);
  };

  //pagination calc
  const totalPages=Math.ceil(tasks.length/tasksPerPage);
  const paginatedTasks=tasks.slice((currentPage-1)*tasksPerPage,currentPage*tasksPerPage);

  //format text in journal
  const formatText=(command)=>{
    document.execCommand(command,false,null);
      editorRef.current.focus();
  };

  //save journal
  const handleSaveJournal=()=>{
      const content=editorRef.current.innerHTML.trim();
      if(!content||content==='<br>') return;
    //new entry object
    const entry={id:Date.now(),date:new Date().toLocaleDateString(),text:content};
    const updated=[entry,...savedEntries];
      setSavedEntries(updated);
      localStorage.setItem('journalEntries',JSON.stringify(updated));
    editorRef.current.innerHTML='';
  };

  //delete journal entry
  const handleDeleteEntry=(id)=>{
    const updated=savedEntries.filter(e=>e.id!==id);
      setSavedEntries(updated);
    localStorage.setItem('journalEntries',JSON.stringify(updated));
  };

  //toggle glass
  const toggleGlass=(index)=>{
      const updated=[...glasses];
    updated[index]=!updated[index];
    setGlasses(updated);
  };

  //count glasses
  const glassCount=glasses.filter(g=>g).length;

  //add expense
  const handleAddExpense=()=>{
      if(!expense||!expenseDesc) return;
    setExpenses([...expenses,{id:Date.now(),amount:Number(expense),desc:expenseDesc}]);
    setExpense('');
      setExpenseDesc('');
  };

  //totals
  const totalExpenses=expenses.reduce((sum,e)=>sum+e.amount,0);
  const balance=Number(income)-totalExpenses;

  //analytics
  const doneCount=tasks.filter(t=>t.done).length;
  const pendingCount=tasks.filter(t=>!t.done).length;
  const donePercent=tasks.length>0?Math.round((doneCount/tasks.length)*100):0;

  //filter tasks
  const filteredTasks=tasks.filter(t=>{
    if(filter==='done') return t.done;
    if(filter==='pending') return !t.done;
      return true;
  });

  //bar chart
  const maxBarHeight=120;
  const maxCount=Math.max(doneCount,pendingCount,tasks.length,1);

  return(
    <div className="container">
      <Routes>

        {/*login route*/}
        <Route path="/" element={
          <div className="auth-page"><Login/></div>
        }/>

        {/*signup route*/}
        <Route path="/signup" element={
          <div className="auth-page"><Signup/></div>
        }/>

        {/*panel route*/}
        <Route path="/panel" element={
          <>
            {/*sidebar*/}
            <div className="sidebar">
              <h2>Elevate Day</h2>
              <ul>
                  <li className={active==='task'?'active-link':''} onClick={()=>setActive('task')}>Tasks</li>
                <li className={active==='journal'?'active-link':''} onClick={()=>setActive('journal')}>Journal</li>
                  <li className={active==='water'?'active-link':''} onClick={()=>setActive('water')}>Water</li>
                <li className={active==='budget'?'active-link':''} onClick={()=>setActive('budget')}>Budget</li>
                  <li className={active==='analytics'?'active-link':''} onClick={()=>setActive('analytics')}>Analytics</li>
              </ul>
            </div>

            {/*right side*/}
            <div className="main">

              {/*navbar*/}
              <div className="navbar">
                <h3>Dashboard</h3>
                <div className="navbar-right">
                  <span className="nav-email">{userEmail}</span>
                    {/* settings button */}
                  <button onClick={()=>setDropdownOpen(!dropdownOpen)}>⚙</button>
                </div>
              </div>

              {/*dropdown*/}
              {dropdownOpen&&(
                <div className="dropdown">
                  <ul>
                      <li onClick={()=>{setActive('profile');setDropdownOpen(false);}}>Profile</li>
                    <li onClick={handleLogout}>Logout</li>
                  </ul>
                </div>
              )}

              <div className="content">

                {/*tasks*/}
                {active==='task'&&(
                  <div>
                    <div className="task-header">
                        <h4>Task Management</h4>
                      <button className="add-btn" onClick={openAddModal}>Add Task</button>
                    </div>
                    <p style={{fontSize:'12px',color:'#888',marginBottom:'10px'}}>Drag tasks to reorder</p>

                    {/*task list*/}
                    <div className="list-task">
                      {paginatedTasks.map((task,index)=>(
                        <div
                          key={task.id}
                          className={`task-card ${task.done?'done':''}`}
                          draggable
                          onDragStart={()=>handleDragStart(index+(currentPage-1)*tasksPerPage)}
                          onDragEnter={()=>handleDragEnter(index+(currentPage-1)*tasksPerPage)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e)=>e.preventDefault()}
                          style={{cursor:'grab'}}
                        >
                        {/*checkbox*/}
                          <input
                              type="checkbox"
                              className="task-check"
                              checked={task.done}
                              onChange={()=>handleCheckTask(task.id)}
                          />
                          <div className="task-info">
                            <p className="task-title">{task.title}</p>
                            <p className="task-desc">{task.desc}</p>
                          </div>
                          <div className="task-actions">
                              <button onClick={()=>openEditModal(task)}>✏️</button>
                            <button onClick={()=>handleDeleteTask(task.id)}>🗑️</button>
                          </div>
                        </div>
                      ))}
                      {tasks.length===0&&<p style={{color:'#888'}}>No tasks yet. Add one!</p>}
                    </div>

                    {/*pagination*/}
                    {totalPages>1&&(
                      <div className="pagination">
                          <button onClick={()=>setCurrentPage(p=>p-1)} disabled={currentPage===1}>Prev</button>
                        <span>{currentPage} / {totalPages}</span>
                          <button onClick={()=>setCurrentPage(p=>p+1)} disabled={currentPage===totalPages}>Next</button>
                      </div>
                    )}
                  </div>
                )}

                {/*journal*/}
                {active==='journal'&&(
                  <div>
                    <div className="task-header">
                        <h4>Daily Journal</h4>
                      <button className="add-btn" onClick={()=>setShowSaved(!showSaved)}>
                          {showSaved?'Write':'Saved'}
                      </button>
                    </div>
                    {/*write mode*/}
                    {!showSaved&&(
                      <div>
                        <div className="editor-toolbar">
                            <button onMouseDown={(e)=>{e.preventDefault();formatText('bold');}}><b>B</b></button>
                          <button onMouseDown={(e)=>{e.preventDefault();formatText('italic');}} style={{fontStyle:'italic'}}>I</button>
                          <button onMouseDown={(e)=>{e.preventDefault();formatText('underline');}} style={{textDecoration:'underline'}}>U</button>
                        </div>
                        <div ref={editorRef} className="editor-box" contentEditable={true} suppressContentEditableWarning={true}/>
                        <button className="add-btn" style={{marginTop:'12px'}} onClick={handleSaveJournal}>Save Entry</button>
                      </div>
                    )}
                    {/*saved entries*/}
                    {showSaved&&(
                      <div className="list-task">
                        {savedEntries.length===0&&<p style={{color:'#888'}}>No saved entries yet.</p>}
                        {savedEntries.map(entry=>(
                          <div key={entry.id} className="task-card" style={{flexDirection:'column',alignItems:'flex-start'}}>
                            <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
                                <p style={{fontWeight:'bold',color:'#1a6e9a'}}>{entry.date}</p>
                              <button onClick={()=>handleDeleteEntry(entry.id)}>🗑️</button>
                           </div>
                            <div dangerouslySetInnerHTML={{__html:entry.text}} style={{marginTop:'8px',fontSize:'14px'}}/>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/*water tracker*/}
                {active==='water'&&(
                  <div>
                      <h4>Water Tracker</h4>
                    <p style={{marginBottom:'16px',color:'#555'}}>
                        You drank <strong style={{color:'#1a6e9a'}}>{glassCount}</strong> / 8 glasses today
                    </p>
                    <div className="water-glass">
                        {glasses.map((filled,i)=>(
                          <label key={i} className="glassbox">
                            <input type="checkbox" checked={filled} onChange={()=>toggleGlass(i)}/>
                            <span style={{fontSize:'30px',filter:filled?'none':'grayscale(1) opacity(0.4)'}}>🥛</span>
                            
                          </label>
                        ))}
                    </div>
                    {glassCount===8&&(
                        <p style={{marginTop:'16px',color:'#1a6e9a',fontWeight:'bold'}}>Goal complete! Great job!</p>
                    )}
                  </div>
                )}

                {/*budget tracker*/}
                {active==='budget'&&(
                  <div>
                    <h4>Budget Tracker</h4>
                    {/*income*/}
                    <div className="budget-section">
                        <label className="budget-label">Monthly Income (₹)</label>
                      <input className="modal-input" type="number" placeholder="Enter income" value={income} onChange={(e)=>setIncome(e.target.value)} style={{maxWidth:'280px',marginBottom:'20px'}}/>
                    </div>
                    {/*add expense*/}
                    <div className="budget-section">
                        <label className="budget-label">Add Expense</label>
                      <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginBottom:'12px'}}>
                          <input className="modal-input" type="number" placeholder="Amount (₹)" value={expense} onChange={(e)=>setExpense(e.target.value)} style={{maxWidth:'150px'}}/>
                        <input className="modal-input" type="text" placeholder="Description" value={expenseDesc} onChange={(e)=>setExpenseDesc(e.target.value)} style={{maxWidth:'200px'}}/>
                        <button className="add-btn" onClick={handleAddExpense}>Add</button>
                      </div>
                    </div>
                    {/*summary*/}
                    <div className="budget-summary">
                      <div className="budget-card" style={{borderColor:'#1a6e9a'}}>
                          <span style={{color:'#1a6e9a',fontSize:'20px',fontWeight:'700'}}>₹{income||0}</span>
                        <span style={{fontSize:'12px',color:'#888'}}>Income</span>
                      </div>
                      <div className="budget-card" style={{borderColor:'#d97706'}}>
                          <span style={{color:'#d97706',fontSize:'20px',fontWeight:'700'}}>₹{totalExpenses}</span>
                        <span style={{fontSize:'12px',color:'#888'}}>Expenses</span>
                      </div>
                      <div className="budget-card" style={{borderColor:balance>=0?'#1a6e9a':'#e74c3c'}}>
                          <span style={{color:balance>=0?'#1a6e9a':'#e74c3c',fontSize:'20px',fontWeight:'700'}}>₹{balance}</span>
                        <span style={{fontSize:'12px',color:'#888'}}>Balance</span>
                      </div>
                    </div>
                    {/*expense list*/}
                    {expenses.length>0&&(
                      <div className="list-task" style={{marginTop:'16px'}}>
                          {expenses.map(e=>(
                            <div key={e.id} className="task-card">
                              <div className="task-info"><p className="task-title">{e.desc}</p></div>
                                <span style={{fontWeight:'700',color:'#d97706'}}>₹{e.amount}</span>
                              <button onClick={()=>setExpenses(expenses.filter(x=>x.id!==e.id))} style={{background:'none',border:'none',cursor:'pointer'}}>🗑️</button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/*analytics*/}
                {active==='analytics'&&(
                  <div>
                    <h4>Analytics</h4>
                    {/*stat cards*/}
                    <div className="stats-row">
                        <div className="stat-card">
                          <span className="stat-number">{tasks.length}</span>
                          <span className="stat-label">Total Tasks</span>
                        </div>
                      <div className="stat-card done-card">
                          <span className="stat-number">{doneCount}</span>
                          <span className="stat-label">Completed</span>
                      </div>
                      <div className="stat-card pending-card">
                          <span className="stat-number">{pendingCount}</span>
                          <span className="stat-label">Pending</span>
                      </div>
                      <div className="stat-card percent-card">
                          <span className="stat-number">{donePercent}%</span>
                          <span className="stat-label">Done Rate</span>
                      </div>
                    </div>

                    <h4 style={{marginTop:'24px',marginBottom:'14px'}}>Task Overview</h4>
                    {/* bar chart */}
                    <div className="bar-chart">
                      <div className="chart-bars">
                        <div className="bar-group">
                            <span className="bar-value">{doneCount}</span>
                          <div className="bar done-bar" style={{height:`${Math.max((doneCount/maxCount)*maxBarHeight,10)}px`}}/>
                          <p>Done</p>
                        </div>
                        <div className="bar-group">
                            <span className="bar-value">{pendingCount}</span>
                          <div className="bar pending-bar" style={{height:`${Math.max((pendingCount/maxCount)*maxBarHeight,10)}px`}}/>
                          <p>Pending</p>
                        </div>
                        <div className="bar-group">
                            <span className="bar-value">{tasks.length}</span>
                          <div className="bar total-bar" style={{height:`${Math.max((tasks.length/maxCount)*maxBarHeight,10)}px`}}/>
                          <p>Total</p>
                        </div>
                      </div>
                      {/*legend*/}
                      <div className="chart-legend">
                        <span><span className="legend-dot" style={{backgroundColor:'#1a6e9a'}}/> Done</span>
                        <span><span className="legend-dot" style={{backgroundColor:'#d97706'}}/> Pending</span>
                        <span><span className="legend-dot" style={{backgroundColor:'#0369a1'}}/> Total</span>
                      </div>
                    </div>

                    {/*filter*/}
                    <div className="filter-bar" style={{marginTop:'24px'}}>
                      <label>Filter Tasks:</label>
                      <select value={filter} onChange={(e)=>setFilter(e.target.value)}>
                          <option value="all">All</option>
                        <option value="done">Done</option>
                          <option value="pending">Pending</option>
                      </select>
                      <span className="filter-count">{filteredTasks.length} tasks</span>
                    </div>
                    <div className="filtered-tasks">
                      {filteredTasks.map(t=>(
                        <div key={t.id} className={`task-card ${t.done?'done':''}`}>
                            <div className="task-info">
                              <p className="task-title">{t.title}</p>
                           <p className="task-desc">{t.desc}</p>
                            </div>
                          <span className={t.done?'badge-done':'badge-pending'}>{t.done?'Done':'Pending'}</span>
                        </div>
                      ))}
                      {filteredTasks.length===0&&<p style={{color:'#888',marginTop:'10px'}}>No tasks found.</p>}
                    </div>
                  </div>
                )}

                {/*profile*/}
                {active==='profile'&&(
                  <div className="profile-section">
                    <h4>Profile</h4>

                    {/*profile pic*/}
                    <div className="profile-img-box">
                      {profileData.image?(
                          <img src={profileData.image} alt="profile" className="profile-img"/>
                      ):(
                        <div style={{
                          width:'80px',
                          height:'80px',
                          borderRadius:'50%',
                          backgroundColor:'#1a6e9a',
                          display:'flex',
                          alignItems:'center',
                          justifyContent:'center',
                          color:'#fff',
                          fontSize:'28px',
                          fontWeight:'700',
                          border:'3px solid #1a6e9a',
                        }}>
                          {/*default icon*/}
                          👤
                        </div>
                      )}
                      {/*upload image*/}
                      <input type="file" accept="image/*" onChange={(e)=>{
                        const file=e.target.files[0];
                        if(!file) return;
                        //read as base64 so it saves in localStorage
                        const reader=new FileReader();
                        reader.onload=(ev)=>{
                          setProfileData({...profileData,image:ev.target.result});
                        };
                        reader.readAsDataURL(file);
                      }}/>
                    </div>

                    {/*edit mode*/}
                    {editProfile?(
                      <div className="profile-fields">
                        <input
                            placeholder="Full Name"
                            value={profileData.name}
                            onChange={(e)=>setProfileData({...profileData,name:e.target.value})}
                        />
                        <input
                          type="number"
                          placeholder="Age"
                          value={profileData.age}
                            onChange={(e)=>setProfileData({...profileData,age:e.target.value})}
                        />
                        <input
                            placeholder="Phone Number"
                            value={profileData.phone}
                            onChange={(e)=>setProfileData({...profileData,phone:e.target.value})}
                        />
                        <input
                          placeholder="City"
                          value={profileData.city}
                            onChange={(e)=>setProfileData({...profileData,city:e.target.value})}
                        />
                        <input
                            placeholder="Short Bio"
                            value={profileData.bio}
                            onChange={(e)=>setProfileData({...profileData,bio:e.target.value})}
                        />
                        <input
                          placeholder="Email"
                          value={userEmail}
                          readOnly
                            style={{backgroundColor:'#f0f0f0',cursor:'not-allowed'}}
                        />
                        {/*save button*/}
                        <button onClick={()=>{
                          setEditProfile(false);
                          //show saved toast
                          setSavedMsg(true);
                          setTimeout(()=>setSavedMsg(false),2500);
                        }}>Save</button>
                      </div>
                    ):(
                      <div className="profile-info">
                          <p><strong>Name:</strong> {profileData.name||'Not set'}</p>
                          <p><strong>Age:</strong> {profileData.age||'Not set'}</p>
                        <p><strong>Phone:</strong> {profileData.phone||'Not set'}</p>
                          <p><strong>City:</strong> {profileData.city||'Not set'}</p>
                        <p><strong>Bio:</strong> {profileData.bio||'Not set'}</p>
                          <p><strong>Email:</strong> {userEmail||'Not set'}</p>
                        {/* edit button */}
                        <button onClick={()=>setEditProfile(true)}>Edit Profile</button>
                      </div>
                    )}

                    {/*saved toast*/}
                    {savedMsg&&(
                      <div style={{
                        backgroundColor:'#1a6e9a',
                        color:'#fff',
                        padding:'10px 16px',
                        borderRadius:'8px',
                        fontSize:'13px',
                        fontWeight:'600',
                      }}>
                        Profile saved!
                      </div>
                    )}

                    {/*logout*/}
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                  </div>
                )}

              </div>
            </div>

            {/*auto logout warning*/}
            {showWarning&&(
              <div style={{
                position:'fixed',
                bottom:'28px',
                right:'28px',
                backgroundColor:'#1a6e9a',
                color:'#fff',
                padding:'16px 22px',
                borderRadius:'12px',
                boxShadow:'0 4px 16px rgba(0,0,0,0.3)',
                border:'2px solid #0c3043',
                zIndex:9999,
                minWidth:'280px',
              }}>
                {/*warning message*/}
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                  <span style={{fontSize:'20px'}}>⚠️</span>
                  <div>
                      <p style={{margin:0,fontWeight:'700',fontSize:'14px',color:'#000000'}}>Session Expiring Soon!</p>
                    <p style={{margin:0,fontSize:'12px',color:'rgba(255,255,255,0.65)',marginTop:'3px'}}>
                        You will be logged out in 3 minute.
                    </p>
                  </div>
                </div>
                {/*buttons*/}
                <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
                  <button
                      onClick={()=>setShowWarning(false)}
                      style={{padding:'6px 14px',borderRadius:'6px',border:'none',backgroundColor:'rgba(255,255,255,0.1)',color:'#fff',fontSize:'12px',cursor:'pointer'}}
                  >Dismiss</button>
                  <button
                    onClick={handleLogout}
                      style={{padding:'6px 14px',borderRadius:'6px',border:'none',backgroundColor:'rgba(255,255,255,0.1)',color:'#fff',fontSize:'12px',fontWeight:'700',cursor:'pointer'}}
                  >Logout Now</button>
                </div>
              </div>
            )}

            {/*add/edit task modal*/}
            {showModal&&(
              <div className="modal-overlay" onClick={()=>setShowModal(false)}>
                <div className="modal" onClick={(e)=>e.stopPropagation()}>
                    <h4>{editTask?'Edit Task':'Add Task'}</h4>
                  <input className="modal-input" placeholder="Title" value={titleInput} onChange={(e)=>setTitleInput(e.target.value)}/>
                  {titleError&&<p className="error">{titleError}</p>}
                  <input className="modal-input" placeholder="Description" value={descInput} onChange={(e)=>setDescInput(e.target.value)}/>
                  <div className="modal-btns">
                      <button className="save-btn" onClick={handleSaveTask}>Save</button>
                    <button className="cancel-btn" onClick={()=>setShowModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

          </>
        }/>

      </Routes>
    </div>
  );
}

export default Panel;
