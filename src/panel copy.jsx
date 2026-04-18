import {Routes,Route} from 'react-router-dom';
import Login from './login.jsx';
import Signup from './signup.jsx';
import {useState,useRef,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import {logout} from './store.js';
import "./panel.css";

function Panel(){
const dispatch=useDispatch();
const userEmail=useSelector((state)=>state.auth.email);
const [open,setOpen]=useState(false);
const [active,setActive]=useState('task');
const [selected,setSelected]=useState([]);
const [filter,setFilter]=useState('all');
const [task,setTask]=useState([
{id:1,title:'Buy groceries',desc:'Milk,bread,butter'},
{id:2,title:'Do workout',desc:'30 min walk'},
{id:3,title:'Study React',desc:'Hooks,Functional Components'},
{id:4,title:'Read a book',desc:'30 pages'},
{id:5,title:'Call parents',desc:'Evening call'},
{id:6,title:'Cook dinner',desc:'Try new recipe'},
{id:7,title:'Clean room',desc:'Organize desk'}
]);
const [showModal,setShowModal]=useState(false);
const [editTask,setEditTask]=useState(null);
const [currentPage,setCurrentPage]=useState(1);
const tasksPerPage=5;
const [profileData,setProfileData]=useState({name:'',image:''});
const [editProfile,setEditProfile]=useState(false);
const editorRef=useRef(null);
const [savedEntries,setSavedEntries]=useState(()=>{
const stored=localStorage.getItem('journalEntries');
return stored?JSON.parse(stored):[];
});
const [showSaved,setShowSaved]=useState(false);
useEffect(()=>{
if(active==='journal'&&editorRef.current){
editorRef.current.focus();
}
},[active]);
const format=(command,value=null)=>{
editorRef.current.focus();
document.execCommand(command,false,value);
};
const handleSaveJournal=()=>{
const content=editorRef.current.innerHTML.trim();
if(!content||content==='<br>') return;
const entry={id:Date.now(),date:new Date().toLocaleDateString(),text:content};
const updated=[entry,...savedEntries];
setSavedEntries(updated);
localStorage.setItem('journalEntries',JSON.stringify(updated));
editorRef.current.innerHTML='';
};
const handleDeleteEntry=(id)=>{
const updated=savedEntries.filter(e=>e.id!==id);
setSavedEntries(updated);
localStorage.setItem('journalEntries',JSON.stringify(updated));
};
const formik=useFormik({
initialValues:{title:'',desc:''},
enableReinitialize:true,
validate:(values)=>{
const errors={};
if(!values.title) errors.title='Title is important!';
return errors;
},
onSubmit:(values)=>{
if(editTask){
setTask(task.map(t=>t.id===editTask.id?{...t,...values}:t));
}else{
setTask([...task,{id:Date.now(),...values}]);
}
setShowModal(false);
setEditTask(null);
formik.resetForm();
}
});
const handleChange=(event)=>{
const value=event.target.value;
if(event.target.checked){
setSelected([...selected,value]);
}else{
setSelected(selected.filter(item=>item!==value));
}
};
const handleDelete=(id)=>{
setTask(task.filter(t=>t.id!==id));
};
const handleCheck=(id)=>{
setTask(task.map(t=>t.id===id?{...t,done:!t.done}:t));
};
const openModal=()=>{
setEditTask(null);
formik.resetForm({values:{title:'',desc:''}});
setShowModal(true);
};
const handleEdit=(t)=>{
setEditTask(t);
formik.resetForm({values:{title:t.title,desc:t.desc}});
setShowModal(true);
};
const totalPages=Math.ceil(task.length/tasksPerPage);
const paginatedTasks=task.slice((currentPage-1)*tasksPerPage,currentPage*tasksPerPage);
const filteredTasks=task.filter(t=>{
if(filter==='done') return t.done;
if(filter==='pending') return !t.done;
return true;
});
const doneCount=task.filter(t=>t.done).length;
const pendingCount=task.filter(t=>!t.done).length;
return(
<div className='container'>
<Routes>
<Route path="/" element={
<div className="auth-page"><Login/></div>
}/>
<Route path="/signup" element={
<div className="auth-page"><Signup/></div>
}/>
<Route path="/panel" element={
<>
<div className="sidebar">
<h2>Dashboard</h2>
<ul>
<li onClick={()=>setActive('task')}>Task Management</li>
<li onClick={()=>setActive('journal')}>Daily Journal</li>
<li onClick={()=>setActive('water')}>Water-Intake Tracker</li>
<li onClick={()=>setActive('budget')}>Budget Tracker</li>
<li onClick={()=>setActive('analytics')}>Analytics</li>
</ul>
</div>
<div className='main'>
<div className="navbar">
<h3>Elevate Day</h3>
<span style={{fontSize:'14px',color:'whitesmoke',marginRight:'auto',marginLeft:'12px'}}>{userEmail}</span>
<button onClick={()=>setOpen(!open)}>⚙</button>
</div>
{open&&(
<div className='dropdown'>
<ul>
<li onClick={()=>{setActive('profile');setOpen(false);}}>Profile</li>
<li onClick={()=>dispatch(logout())}>Logout</li>
</ul>
</div>
)}
<div className="content">

{active==='task'&&(
<div>
<div className='taskHeader'>
<h4>Task Management</h4>
<button className='add-btn' onClick={openModal}>Add Task</button>
</div>
<div className='list-task'>
{paginatedTasks.map(task=>(
<div key={task.id} className={`task-card ${task.done?'done':''}`}>
<input
type='checkbox'
checked={task.done||false}
onChange={()=>handleCheck(task.id)}
className='task-check'
/>
<div className='task-info'>
<p className='task-title'>{task.title}</p>
<p className='task-desc'>{task.desc}</p>
</div>
<div className='task-actions'>
<button onClick={()=>handleEdit(task)}>Edit</button>
<button onClick={()=>handleDelete(task.id)}>Delete</button>
</div>
</div>
))}
</div>
<div className='pagination'>
<button onClick={()=>setCurrentPage(p=>p-1)} disabled={currentPage===1}>Prev</button>
<span>{currentPage} / {totalPages}</span>
<button onClick={()=>setCurrentPage(p=>p+1)} disabled={currentPage===totalPages}>Next</button>
</div>
</div>
)}

{active==='journal'&&(
<div>
<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
<h4 style={{margin:0}}>Daily Journal</h4>
<button className='add-btn' onClick={()=>setShowSaved(!showSaved)}>
{showSaved?'Write':'Saved Entries'}
</button>
</div>
{!showSaved&&(
<div>
<div className='editor-toolbar'>
<button onMouseDown={(e)=>{e.preventDefault();format('bold');}}><b>B</b></button>
<button onMouseDown={(e)=>{e.preventDefault();format('italic');}} style={{fontStyle:'italic'}}>I</button>
<button onMouseDown={(e)=>{e.preventDefault();format('underline');}} style={{textDecoration:'underline'}}>U</button>
<input type='color' onChange={(e)=>format('foreColor',e.target.value)} title='Text Color'/>
</div>
<div
ref={editorRef}
className='editor-box'
contentEditable={true}
suppressContentEditableWarning={true}
/>
<button className='add-btn' style={{marginTop:'10px'}} onClick={handleSaveJournal}>Save Entry</button>
</div>
)}
{showSaved&&(
<div>
{savedEntries.length===0&&<p>No saved entries yet.</p>}
{savedEntries.map(entry=>(
<div key={entry.id} className='task-card' style={{flexDirection:'column',alignItems:'flex-start'}}>
<div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
<p style={{fontWeight:'bold',color:'#075345'}}>{entry.date}</p>
<button onClick={()=>handleDeleteEntry(entry.id)}>Delete</button>
</div>
<div dangerouslySetInnerHTML={{__html:entry.text}} style={{marginTop:'6px',fontSize:'14px'}}/>
</div>
))}
</div>
)}
</div>
)}

{active==='water'&&(
<div>
<h4>Water Tracker</h4>
<p>How much water did you drink today?</p>
<div className='water-glass'>
{[...Array(8)].map((_,i)=>(
<label key={i} className='glassbox'>
<input type='checkbox' onChange={handleChange} value={String(i)}/>
🥛
</label>
))}
</div>
</div>
)}

{active==='budget'&&(
<div>
<h4>Budget Tracker</h4>
</div>
)}

{active==='analytics'&&(
<div>
<h4>Analytics</h4>
<div className='filter-bar'>
<label>Filter:</label>
<select onChange={(e)=>setFilter(e.target.value)} value={filter}>
<option value='all'>All</option>
<option value='done'>Done</option>
<option value='pending'>Pending</option>
</select>
</div>
<div className='filtered-tasks'>
{filteredTasks.map(t=>(
<div key={t.id} className={`task-card ${t.done?'done':''}`}>
<div className='task-info'>
<p className='task-title'>{t.title}</p>
<p className='task-desc'>{t.desc}</p>
</div>
<span className={t.done?'badge-done':'badge-pending'}>
{t.done?'Done':'Pending'}
</span>
</div>
))}
</div>
<h4 style={{marginTop:'30px'}}>Task Overview</h4>
<div className='bar-chart'>
<div className='bar-group'>
<div className='bar done-bar' style={{height:`${doneCount*50}px`}}>
<span>{doneCount}</span>
</div>
<p>Done</p>
</div>
<div className='bar-group'>
<div className='bar pending-bar' style={{height:`${pendingCount*50}px`}}>
<span>{pendingCount}</span>
</div>
<p>Pending</p>
</div>
</div>
</div>
)}

{active==='profile'&&(
<div className='profile-section'>
<h4>Profile</h4>
<div className='profile-img-box'>
<img
src={profileData.image||'https://via.placeholder.com/100'}
alt='profile'
className='profile-img'
/>
<input type='file' accept='image/*' onChange={(e)=>{
const file=e.target.files[0];
if(file) setProfileData({...profileData,image:URL.createObjectURL(file)});
}}/>
</div>
{editProfile?(
<div className='profile-fields'>
<input placeholder='Name' value={profileData.name} onChange={(e)=>setProfileData({...profileData,name:e.target.value})}/>
<input
placeholder='Email'
value={userEmail}
disabled
style={{background:'#eee',cursor:'not-allowed'}}
/>
<button onClick={()=>setEditProfile(false)}>Save</button>
</div>
):(
<div className='profile-info'>
<p><strong>Name:</strong> {profileData.name||'add name'}</p>
<p><strong>Email:</strong> {userEmail||'add email'}</p>
<button onClick={()=>setEditProfile(true)}>Edit</button>
</div>
)}
</div>
)}

</div>
</div>

{showModal&&(
<div className='modal-overlay' onClick={()=>setShowModal(false)}>
<div className='modal' onClick={e=>e.stopPropagation()}>
<h4>{editTask?'Edit Task':'Add Task'}</h4>
<input
className='modal-input'
placeholder='Title'
name='title'
value={formik.values.title}
onChange={formik.handleChange}
/>
{formik.errors.title&&<p className='error'>{formik.errors.title}</p>}
<input
className='modal-input'
placeholder='Description'
name='desc'
value={formik.values.desc}
onChange={formik.handleChange}
/>
<div className='modal-btns'>
<button className='save-btn' onClick={formik.handleSubmit}>Save</button>
<button className='cancel-btn' onClick={()=>setShowModal(false)}>Cancel</button>
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
