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

export const editWelcomeEditorState = (welcomeEditorState) => ({
    type: 'EDIT_WELCOME_EDITOR_STATE',
    welcomeEditorState
})

export const editCompaniesEditorState = (companiesEditorState) => ({
    type: 'EDIT_COMPANIES_EDITOR_STATE',
    companiesEditorState
})

export const editMembersEditorState = (membersEditorState) => ({
    type: 'EDIT_MEMBERS_EDITOR_STATE',
    membersEditorState
})

export const updateLastUpdatedDate = (lastUpdatedDate) => ({
    type: 'UPDATE_LAST_UPDATED_DATE',
    lastUpdatedDate
})