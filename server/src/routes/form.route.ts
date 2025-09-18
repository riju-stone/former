import { User } from "better-auth/*";
import { Hono } from "hono";
import * as queries from "@db/queries/form.queries";
import redis from "@utils/cache";
import customLogger from "@utils/logger";

const formRoute = new Hono();

// PROTECTED ROUTES
// Fetch All Live Forms by a user
formRoute.get("/form/builder/all/live", async (c) => {
  const user = c.get("user" as never) as User;

  try {
    const liveForms = await queries.fetchAllLiveFormsByUser(user.id);
    return c.json({ data: liveForms });
  } catch (err) {
    customLogger.error(`Error fetching live forms: ${JSON.stringify(err)}`);
    return c.json({ message: "Error fetching live forms" }, 500);
  }
});

// Fetch all form builder drafts by a user
formRoute.get("/form/builder/all/saved", async (c) => {
  const user = c.get("user" as never) as User;

  try {
    const savedForms = await queries.fetchAllSavedFormsByUser(user.id);
    return c.json({ data: savedForms });
  } catch (err) {
    customLogger.error(`Error fetching saved forms: ${JSON.stringify(err)}`);
    return c.json({ message: "Error fetching saved forms" }, 500);
  }
});

// Upload Form
formRoute.post("/form/builder/upload", async (c) => {
  const user = c.get("user" as never) as User;
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
    userId: user.id,
    formName: formTitle,
    builderData: formBuilderData,
    ...formData,
  };

  try {
    await queries.publishForm(_formUploadData);
    return c.json({ message: "Form uploaded successfully" });
  } catch (err) {
    customLogger.error(`Error uploading form: ${JSON.stringify(err)}`);
    return c.json({ message: "Error uploading form" }, 500);
  }
});

// Save form builder draft data
formRoute.post("/form/builder/draft", async (c) => {
  const user = c.get("user" as never) as User;
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

  const _formDraftData = {
    id: formId,
    userId: user.id,
    formName: formTitle,
    builderData: formBuilderData,
    ...formData,
  };

  // Here, you would typically process and save the formData to your database
  try {
    await queries.uploadFormBuilderDraft(_formDraftData);
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
    const formData = await queries.fetchSavedFormById(formId);
    return c.json({ data: formData });
  } catch (err) {
    customLogger.error(`Error fetching form data: ${JSON.stringify(err)}`);
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
    const cachedFormData = await redis.get(formId);
    if (cachedFormData) {
      customLogger.debug(`Cache hit for formId: ${formId} = ${cachedFormData}`);
      return c.json({ data: cachedFormData });
    } else {
      const formData = await queries.fetchLiveFormById(formId);
      await redis.set(formId, formData, { ex: 3600 * 5 }); // Cache for 5 hours
      customLogger.debug(`Cache miss for formId: ${formId}. Fetched from DB.`);
      return c.json({ data: formData });
    }
  } catch (err) {
    customLogger.error(`Error fetching form data: ${JSON.stringify(err)}`);
    return c.json({ message: "Error fetching form data" }, 500);
  }
});

// Submit Form Response
formRoute.post("/form/submit", async (c) => {
  return c.json({ message: "Form submitted successfully" });
});

export default formRoute;
