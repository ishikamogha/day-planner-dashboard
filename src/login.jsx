import {useNavigate,Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {login} from './store.js';
import {useFormik} from 'formik';

//fake creds
const FAKE_EMAIL='admin@gmail.com';
const FAKE_PASSWORD='1234';

function Login(){
  //hooks
  const navigate=useNavigate();
  const dispatch=useDispatch();

  //formik
  const formik=useFormik({
    initialValues:{email:'',password:''},
    //validate
    validate:(values)=>{
      const errors={};
      //email check
      if(!values.email){
        errors.email='Email is required!';
      }else if(!values.email.includes('@')){
          errors.email='Enter a valid Email!';
      }
      //password check
      if(!values.password){
          errors.password='Password is required!';
      }
      return errors;
    },
    //submit
    onSubmit:(values)=>{
      if(values.email!==FAKE_EMAIL||values.password!==FAKE_PASSWORD){
          formik.setErrors({password:'Invalid email or password!'});
          return;
      }
      //dispatch
      dispatch(login(values.email));
      setTimeout(()=>{
        navigate('/panel');
      },1500);
    }
  });

  //styles
  const page={
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    minHeight:'100vh',
    backgroundColor:'#1a6e9a',
  };

  const card={
    backgroundColor:'#fff',
    borderRadius:'12px',
    padding:'40px 36px',
    width:'400px',
    boxShadow:'0 4px 20px rgba(0,0,0,0.15)',
    border:'1px solid #ddd',
  };

  const heading={
    color:'#1a6e9a',
    fontSize:'24px',
    fontWeight:'700',
    marginBottom:'6px',
    textAlign:'center',
  };

  const sub={
    color:'#888',
    fontSize:'13px',
    textAlign:'center',
    marginBottom:'10px',
  };

  const hint={
    backgroundColor:'#eaf4fb',
    border:'1px solid #b3d9ee',
    borderRadius:'8px',
    padding:'8px 12px',
    textAlign:'center',
    marginBottom:'20px',
    color:'#555',
    fontSize:'12px',
  };

  const hintStrong={
    color:'#1a6e9a',
    fontWeight:'700',
  };

  const label={
    color:'#444',
    fontSize:'12px',
    fontWeight:'600',
    marginBottom:'5px',
    display:'block',
  };

  const input={
    width:'100%',
    padding:'11px 14px',
    borderRadius:'8px',
    border:'1.5px solid #ccc',
    backgroundColor:'#f9f9f9',
    color:'#222',
    fontSize:'14px',
    outline:'none',
    boxSizing:'border-box',
    marginBottom:'4px',
  };

  const errorStyle={
    color:'#e74c3c',
    fontSize:'11px',
    marginBottom:'10px',
    marginTop:'2px',
  };

  const field={
    marginBottom:'14px',
  };

  const btn={
    width:'100%',
    padding:'13px',
    borderRadius:'8px',
    border:'none',
    backgroundColor:'#1a6e9a',
    color:'#fff',
    fontSize:'15px',
    fontWeight:'700',
    cursor:'pointer',
    marginTop:'6px',
  };

  const linkRow={
    textAlign:'center',
    marginTop:'20px',
    color:'#888',
    fontSize:'13px',
  };

  const linkStyle={
    color:'#1a6e9a',
    fontWeight:'600',
    textDecoration:'none',
  };

  return(
    <div style={page}>
      <div style={card}>
        <h2 style={heading}>Welcome Back</h2>
        <p style={sub}>Login to your Elevate Day dashboard</p>

        {/*hint box*/}
        <div style={hint}>
          Fake Email: <span style={hintStrong}>{FAKE_EMAIL}</span> &nbsp;|&nbsp; Password: <span style={hintStrong}>{FAKE_PASSWORD}</span>
        </div>

        {/*email*/}
        <div style={field}>
          <label style={label}>EMAIL ADDRESS</label>
          <input
            style={input}
            type='email'
            name='email'
            placeholder='email@gmail.com'
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.errors.email&&<p style={errorStyle}>{formik.errors.email}</p>}
        </div>

        {/*password*/}
        <div style={field}>
          <label style={label}>PASSWORD</label>
          <input
            style={input}
            type='password'
            name='password'
            placeholder='Enter your password'
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.errors.password&&<p style={errorStyle}>{formik.errors.password}</p>}
        </div>

        {/*button*/}
        <button style={btn} onClick={formik.handleSubmit}>
          Login
        </button>

        {/*signup link*/}
        <div style={linkRow}>
          Don't have an account?{' '}
          <Link to='/signup' style={linkStyle}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
