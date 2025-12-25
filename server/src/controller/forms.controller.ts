import { Context } from "hono";
import customLogger from "@utils/logger";
import formProcessingQueue from "@utils/queue";
import { User } from "better-auth/*";
import * as queries from "@db/queries/form.queries";
import redis from "@utils/cache";

export async function handlePublishForm(c: Context) {
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
}

export async function handleSaveDraftForm(c: Context) {
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
}

export async function handleFetchAllUserLiveForms(c: Context) {
  const user = c.get("user" as never) as User;
  // Fetch saved draft forms for a user

  if (user) {
    try {
      const liveForms = await queries.fetchAllLiveFormsByUser(user.id);
      return c.json({ data: liveForms });
    } catch (err) {
      customLogger.error(`Error fetching live forms: ${JSON.stringify(err)}`);
      return c.json({ message: "Error fetching live forms" }, 500);
    }
  }
}

export async function handleFetchAllUserDraftForms(c: Context) {
  const user = c.get("user" as never) as User;

  if (user) {
    try {
      const savedForms = await queries.fetchAllSavedFormsByUser(user.id);
      return c.json({ data: savedForms });
    } catch (err) {
      customLogger.error(`Error fetching saved forms: ${JSON.stringify(err)}`);
      return c.json({ message: "Error fetching saved forms" }, 500);
    }
  }
}

export async function handleFetchDraftForm(c: Context) {
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
}

export async function handleFormSubmission(c: Context) {
  const { formSubmissionData } = await c.req.json();

  if (!formSubmissionData) {
    return c.json({ message: "Form submission data is required" }, 400);
  }

  const { formId, userEmail, submissionData } = formSubmissionData;

  if (!formId || !userEmail || !submissionData) {
    return c.json(
      { message: "formId, userEmail, and submissionData are required" },
      400
    );
  }

  const _formSubmissionData = {
    id: crypto.randomUUID(),
    formId,
    user_email: userEmail,
    submissionData,
  };

  try {
    await queries.submitFormResponse(_formSubmissionData);
  } catch (err) {
    customLogger.error(
      `Error submitting form response: ${JSON.stringify(err)}`
    );
    return c.json({ message: "Error submitting form response" }, 500);
  }

  return c.json({ message: "Form submitted successfully" });
}

export async function handleFormSubmissionV2(c: Context) {
  try {
    // Validate form data
    const { formId, userEmail, submissionData } = await c.req.json();

    if (!formId || !userEmail || !submissionData) {
      return c.json(
        { message: "formId, userEmail, and submissionData are required" },
        400
      );
    }

    const _formSubmissionData = {
      id: crypto.randomUUID(),
      formId,
      user_email: userEmail,
      submissionData,
    };

    // Push form submission data into queue
    await formProcessingQueue.add({
      event: JSON.stringify(_formSubmissionData),
      message: "New form submission received",
    });

    // Return success response
    return c.json({ message: "Form submission received" });
  } catch (err) {
    customLogger.error(
      `Error processing form submission: ${JSON.stringify(err)}`
    );
    return c.json({ message: "Error processing form submission" }, 500);
  }
}

export async function handleFetchLiveFormData(c: Context) {
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
      await redis.set(formId, formData, { ex: 3600 * 2 }); // Cache for 2 hours
      customLogger.debug(`Cache miss for formId: ${formId}. Fetched from DB.`);
      return c.json({ data: formData });
    }
  } catch (err) {
    customLogger.error(`Error fetching form data: ${JSON.stringify(err)}`);
    return c.json({ message: "Error fetching form data" }, 500);
  }
}
