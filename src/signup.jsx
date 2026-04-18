import {useNavigate,Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {login} from './store.js';
import {useFormik} from 'formik';

//signup page
function Signup(){
  //hooks
  const navigate=useNavigate();
  const dispatch=useDispatch();

  //formik setup
  const formik=useFormik({
    initialValues:{email:'',password:'',confirmpass:''},
    //validate
    validate:(values)=>{
      const errors={};
      //email
      if(!values.email){
          errors.email='Email is required!';
      }else if(!values.email.includes('@')){
        errors.email='Enter a valid Email!';
      }
      //password
      if(!values.password){
        errors.password='Password is required!';
      }else if(values.password.length<6){
          errors.password='Min 6 characters required!';
      }
      //confirm
      if(!values.confirmpass){
          errors.confirmpass='Please confirm your password!';
      }else if(values.password!==values.confirmpass){
        errors.confirmpass='Passwords do not match!';
      }
      return errors;
    },
    //submit
    onSubmit:(values)=>{
      //save to redux
      dispatch(login(values.email));
      setTimeout(()=>{
          navigate('/');
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
    marginBottom:'28px',
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
        <h2 style={heading}>Create Account</h2>
        <p style={sub}>Join Elevate Day and stay productive</p>

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
            placeholder='Enter min 6 characters'
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.errors.password&&<p style={errorStyle}>{formik.errors.password}</p>}
        </div>

        {/*confirm*/}
        <div style={field}>
          <label style={label}>CONFIRM PASSWORD</label>
          <input
            style={input}
            type='password'
            name='confirmpass'
            placeholder='Re-enter password'
            value={formik.values.confirmpass}
            onChange={formik.handleChange}
          />
          {formik.errors.confirmpass&&<p style={errorStyle}>{formik.errors.confirmpass}</p>}
        </div>

        {/*button*/}
        <button style={btn} onClick={formik.handleSubmit}>
          Create Account
        </button>

        {/*login link*/}
        <div style={linkRow}>
          Already have an account?{' '}
          <Link to='/' style={linkStyle}>Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
