const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://cpmhamanager.herokuapp.com/api';

// announcements
export const ANNOUNCEMENT_POST_API = BASE_URL + '/announcements/post';
export const ANNOUNCEMENT_GET_API = BASE_URL + '/announcements/get';
export const ANNOUNCEMENT_GET_RECENT_API = BASE_URL + '/announcements/get/recent';

// events
export const EVENT_POST_API = BASE_URL + '/events/post';
export const EVENT_UPDATE_API = BASE_URL + '/events/update';
export const EVENT_DELETE_API = BASE_URL + '/events/delete';
export const EVENT_GET_SINGLE_API = BASE_URL + '/events/get/single';
export const EVENT_GET_API = BASE_URL + '/events/get';

// interns
export const INTERN_POST_API = BASE_URL + '/interns/post';
export const INTERN_GET_API = BASE_URL + '/interns/get';
export const INTERN_GET_SINGLE_API = BASE_URL + '/interns/get/single';
export const INTERN_UPDATE_API = BASE_URL + '/interns/update';
export const INTERN_UPDATE_WORK_API = BASE_URL + '/interns/update/work';
export const INTERN_ADD_TASK_API = BASE_URL + '/interns/add/task';
export const INTERN_ADD_TEAM_API = BASE_URL + '/interns/add/team';
export const INTERN_DELETE_TASK_API = BASE_URL + '/interns/delete/task';
export const INTERN_DELETE_TEAM_API = BASE_URL + '/interns/delete/team';
export const INTERN_DELETE_API = BASE_URL + '/interns/delete';

// teams
export const TEAM_POST_API = BASE_URL + '/teams/post';
export const TEAM_GET_API = BASE_URL + '/teams/get';
export const TEAM_GET_SINGLE_API = BASE_URL + '/teams/get/single';
export const TEAM_ADD_MEMBERS_API = BASE_URL + '/teams/add/members';
export const TEAM_ADD_TASK_API = BASE_URL + '/teams/add/task';
export const TEAM_DELETE_API = BASE_URL + '/teams/delete';
export const TEAM_DELETE_TASK_API = BASE_URL + '/teams/delete/task';
export const TEAM_DELETE_MEMBER_API = BASE_URL + '/teams/delete/member';
export const TEAM_UPDATE_API = BASE_URL + '/teams/update';

// tasks
export const TASK_POST_API = BASE_URL + '/tasks/post';
export const TASK_GET_API = BASE_URL + '/tasks/get';
export const TASK_GET_SINGLE_API = BASE_URL + '/tasks/get/single';
export const TASK_DELETE_API = BASE_URL + '/tasks/delete';
export const TASK_DELETE_TEAM_API = BASE_URL + '/tasks/delete/team';
export const TASK_DELETE_INTERN_API = BASE_URL + '/tasks/delete/intern';
export const TASK_UPDATE_API = BASE_URL + '/tasks/update';
export const TASK_TOGGLE_COMPLETE_API = BASE_URL + '/tasks/toggle/completed';


