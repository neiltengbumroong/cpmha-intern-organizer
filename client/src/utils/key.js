const MASTER_KEY = window.location.hostname === 'localhost' ? 'paolo' : process.env.MASTER_KEY;
export default MASTER_KEY;