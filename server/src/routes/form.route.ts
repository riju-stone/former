import {
  fetchAllLiveFormsByUser,
  fetchAllSavedFormsByUser,
  fetchLiveFormById,
  fetchSavedFormById,
  publishForm,
  uploadFormBuilderDraft,
} from "@db/queries/form.queries";
import { auth } from "@lib/auth";
import { Hono } from "hono";

const formRoute = new Hono();

// PROTECTED ROUTES
// Fetch All Live Forms by a user
formRoute.get("/form/builder/all/live", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const userId = session?.user.id!;

  try {
    const liveForms = await fetchAllLiveFormsByUser(userId);
    return c.json({ data: liveForms });
  } catch (err) {
    console.error("Error fetching live forms:", err);
    return c.json({ message: "Error fetching live forms" }, 500);
  }
});

// Fetch all form builder drafts by a user
formRoute.get("/form/builder/all/saved", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const userId = session?.user.id!;

  try {
    const savedForms = await fetchAllSavedFormsByUser(userId);
    return c.json({ data: savedForms });
  } catch (err) {
    console.error("Error fetching saved forms:", err);
    return c.json({ message: "Error fetching saved forms" }, 500);
  }
});

// Upload Form
formRoute.post("/form/builder/upload", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const userId = session?.user.id!;
  const { formData } = await c.req.json();

  if (!formData) {
    return c.json({ message: "formData is required" }, 400);
  }

  const { formId, formTitle, formBuilderData } = formData;
  if (!formId || !formTitle || !formBuilderData) {
    return c.json(
      { message: "formId, formTitle, and formBuilderData are required" },
      400
    );
  }

  const _formUploadData = {
    id: formId,
    userId: userId,
    formName: formTitle,
    builderData: formBuilderData,
    ...formData,
  };

  await publishForm(_formUploadData);

  return c.json({ message: "Form uploaded successfully" });
});

// Save form builder draft data
formRoute.post("/form/builder/draft", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const { formData } = await c.req.json();
  const userId = session?.user.id;

  if (!formData) {
    return c.json({ message: "formData is required" }, 400);
  }

  const { formId, formTitle, formBuilderData } = formData;
  if (!formId || !formTitle || !formBuilderData) {
    return c.json(
      { message: "formId, formTitle, and formBuilderData are required" },
      400
    );
  }

  const _formDraftData = {
    id: formId,
    userId: userId!,
    formName: formTitle,
    builderData: formBuilderData,
  };

  // Here, you would typically process and save the formData to your database
  try {
    await uploadFormBuilderDraft(_formDraftData);
  } catch (err) {
    console.error("Error saving form draft:", err);
    return c.json({ message: "Error saving form draft" }, 500);
  }

  return c.json({ message: "Form draft saved successfully" });
});

// Fetch form builder data
formRoute.get("/form/builder/data", async (c) => {
  const { formId } = c.req.query();
  if (!formId) {
    return c.json({ message: "formId query parameter is required" }, 400);
  }

  try {
    const formData = await fetchSavedFormById(formId);
    return c.json({ data: formData });
  } catch (err) {
    console.error("Error fetching form data:", err);
    return c.json({ message: "Error fetching form data" }, 500);
  }
});

// UNPROTECTED ROUTES
// Fetch Live Form
formRoute.get("/form/data", async (c) => {
  const { formId } = c.req.query();
  if (!formId) {
    return c.json({ message: "formId query parameter is required" }, 400);
  }

  try {
    const formData = await fetchLiveFormById(formId);
    return c.json({ data: formData });
  } catch (err) {
    console.error("Error fetching form data:", err);
    return c.json({ message: "Error fetching form data" }, 500);
  }
});

// Submit Form Response
formRoute.post("/form/submit", async (c) => {
  return c.json({ message: "Form submitted successfully" });
});

export default formRoute;
