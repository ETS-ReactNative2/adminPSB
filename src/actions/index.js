export const addCategory = name => ({
    type: 'ADD_CATEGORY',
    name
})

export const deleteCategory = name => ({
    type: 'DELETE_CATEGORY',
    name
})

export const cleanCategories = () => ({
    type: 'CLEAN_CATEGORIES',
    name
})

export const cleanProjects = () => ({
    type: 'CLEAN_PROJECTS',
    name
})

export const addProject = (id,name,description,startDate,coverImg,category,endDate,location) => ({
    type: 'ADD_PROJECT',
    id,
    name,
    description,
    startDate,
    coverImg,
    category,
    endDate,
    location
})

export const editProject = (id,name,description,startDate,coverImg,category,endDate,location) => ({
    type: 'EDIT_PROJECT',
    id,
    name,
    description,
    startDate,
    coverImg,
    category,
    endDate,
    location
})

export const deleteProject = id => ({
    type: 'DELETE_PROJECT',
    id
})

export const editWelcomeText = (welcomeText) => ({
    type: 'EDIT_WELCOME_TEXT',
    welcomeText
})

export const editCompaniesText = (companiesText) => ({
    type: 'EDIT_COMPANIES_TEXT',
    companiesText
})

export const editMembersText = (membersText) => ({
    type: 'EDIT_MEMBERS_TEXT',
    membersText
})