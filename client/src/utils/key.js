const MASTER_KEY = window.location.hostname === 'localhost' ? 'paolo' : process.env.REACT_APP_MASTER_KEY;
const TASK_KEY = window.location.hostname === 'localhost' ? 'cpmha' : process.env.REACT_APP_TASK_KEY;
export { MASTER_KEY, TASK_KEY };