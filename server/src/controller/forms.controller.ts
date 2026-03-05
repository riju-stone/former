import { Context } from "hono";
import customLogger from "../utils/logger.js";
import formProcessingQueue from "../utils/queue.js";
import { User } from "better-auth/*";
import * as queries from "../db/queries/form.queries.js";
import redis from "../utils/cache.js";

import { isValidBuilderData } from "../utils/validation.js";

export async function handlePublishForm(c: Context) {
  const user = c.get("user" as never) as User;
  const { formData } = await c.req.json();

  if (!formData) {
    return c.json({ message: "formData is required" }, 400);
  }

  const { formId, formTitle, formBuilderData, formExpiry } = formData;
  if (!formId || !formTitle || !formBuilderData) {
    return c.json({ message: "formId, formTitle, and formBuilderData are required" }, 400);
  }

  if (!isValidBuilderData(formBuilderData)) {
    return c.json({ message: "formBuilderData has an invalid structure" }, 400);
  }

  // Check if form id exists in the redis cache and invalidate it to prevent stale data after publish
  try {
    const cachedForm = await redis.get(formId);
    if (cachedForm) {
      customLogger.info(`Invalidating cache for formId: ${formId} due to new publish`);
      await redis.del(formId);
    }
  } catch (redisErr) {
    customLogger.warn(
      `Redis error while invalidating cache (continuing with publish): ${
        redisErr instanceof Error ? redisErr.message : String(redisErr)
      }`,
    );
  }

  // Set default expiry to 1 year from now if not provided
  const defaultExpiry = new Date();
  defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);

  const _formUploadData = {
    id: formId,
    userId: user.id,
    formName: formTitle,
    builderData: formBuilderData,
    formExpiry: formExpiry ? new Date(formExpiry) : defaultExpiry,
    ...formData,
  };

  try {
    await queries.publishForm(_formUploadData);
    return c.json({ message: "Form uploaded successfully" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    customLogger.error({ message: errorMessage, stack: errorStack, formId }, "Error uploading form");
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
    return c.json({ message: "formId, formTitle, and formBuilderData are required" }, 400);
  }

  if (!isValidBuilderData(formBuilderData)) {
    return c.json({ message: "formBuilderData has an invalid structure" }, 400);
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
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    customLogger.error({ message: errorMessage, stack: errorStack, formId }, "Error saving form draft");
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
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorStack = err instanceof Error ? err.stack : undefined;
      customLogger.error({ message: errorMessage, stack: errorStack, userId: user.id }, "Error fetching live forms");
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
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorStack = err instanceof Error ? err.stack : undefined;
      customLogger.error({ message: errorMessage, stack: errorStack, userId: user.id }, "Error fetching saved forms");
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

    // Check if form exists
    if (!formData || formData.length === 0) {
      return c.json({ message: "Form not found" }, 404);
    }

    // Get the first result since we're querying by ID
    return c.json({ data: formData[0] });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    customLogger.error({ message: errorMessage, stack: errorStack, formId }, "Error fetching draft form data");
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
    return c.json({ message: "formId, userEmail, and submissionData are required" }, 400);
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
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    customLogger.error({ message: errorMessage, stack: errorStack, formId }, "Error submitting form response");
    return c.json({ message: "Error submitting form response" }, 500);
  }

  return c.json({ message: "Form submitted successfully" });
}

export async function handleFormSubmissionV2(c: Context) {
  try {
    // Validate form data
    const { formId, userEmail, submissionData } = await c.req.json();

    if (!formId || !userEmail || !submissionData) {
      return c.json({ message: "formId, userEmail, and submissionData are required" }, 400);
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
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    customLogger.error({ message: errorMessage, stack: errorStack }, "Error processing form submission");
    return c.json({ message: "Error processing form submission" }, 500);
  }
}

export async function handleFetchLiveFormData(c: Context) {
  const { formId } = c.req.query();

  if (!formId) {
    return c.json({ message: "formId query parameter is required" }, 400);
  }

  customLogger.info(`Fetching live form data for formId: ${formId}`);

  try {
    // Check cache first
    let cachedFormData = null;
    try {
      customLogger.info(`Checking cache for formId: ${formId}`);
      cachedFormData = await redis.get(formId);

      if (cachedFormData) {
        customLogger.info(`Cache hit for formId: ${formId}`);
        return c.json({ data: cachedFormData });
      }
    } catch (redisErr) {
      customLogger.warn(
        `Redis error (continuing without cache): ${redisErr instanceof Error ? redisErr.message : String(redisErr)}`,
      );
    }

    customLogger.info(`Cache miss for formId: ${formId}. Querying database...`);
    const formData = await queries.fetchLiveFormById(formId);
    customLogger.info({ count: formData?.length, hasData: !!formData }, `Query result for formId ${formId}`);

    // Check if form exists
    if (!formData || formData.length === 0) {
      customLogger.warn(`Form not found for formId: ${formId}`);
      return c.json({ message: "Form not found" }, 404);
    }

    // Get the first result since we're querying by ID
    const form = formData[0];
    customLogger.info(`Found form: ${form.id}`);

    // Try to cache the result (non-blocking)
    try {
      await redis.set(formId, form, { ex: 3600 * 2 }); // Cache for 2 hours
      customLogger.info(`Successfully cached form: ${formId}`);
    } catch (redisErr) {
      customLogger.warn(
        `Failed to cache form (non-critical): ${redisErr instanceof Error ? redisErr.message : String(redisErr)}`,
      );
    }

    customLogger.info(`Successfully fetched form: ${formId}`);
    return c.json({ data: form });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    customLogger.error(
      {
        message: errorMessage,
        stack: errorStack,
        formId,
      },
      `Error fetching form data for formId ${formId}`,
    );
    return c.json({ message: "Error fetching form data" }, 500);
  }
}
