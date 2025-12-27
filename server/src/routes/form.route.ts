import { Hono } from "hono";
import * as controller from "../controller/forms.controller.js";

const formRoute = new Hono();

// PROTECTED ROUTES
// Fetch All Live Forms by a user
formRoute.get("/form/builder/all/live", controller.handleFetchAllUserLiveForms);

// Fetch all form builder drafts by a user
formRoute.get("/form/builder/all/saved", controller.handleFetchAllUserDraftForms);

// Upload Form
formRoute.post("/form/builder/upload", controller.handlePublishForm);

// Save form builder draft data
formRoute.post("/form/builder/draft", controller.handleSaveDraftForm);

// Fetch saved form builder data
formRoute.get("/form/builder/data", controller.handleFetchDraftForm);

// UNPROTECTED ROUTES
// Fetch Live Form
formRoute.get("/form/data", controller.handleFetchLiveFormData);

// Submit Form Response
formRoute.post("/form/submit", controller.handleFormSubmission);

export default formRoute;
