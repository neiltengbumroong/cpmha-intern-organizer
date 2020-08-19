const MASTER_KEY = window.location.hostname === 'localhost' ? 'paolo' : process.env.REACT_APP_MASTER_KEY;
export default MASTER_KEY;