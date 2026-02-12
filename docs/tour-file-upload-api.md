# Tour File Upload — API Documentation

**Base URL:** `https://bcknd.tickethub-tours.com/api/admin/tours`

A new optional `file` field has been added to tours, allowing admins to attach a document (e.g. PDF) to a tour.

---

## Create Tour — `POST /`

### Request Body (new field)

| Field  | Type     | Required | Description                                      |
|--------|----------|----------|--------------------------------------------------|
| `file` | `string` | No       | Base64-encoded document (e.g. `data:application/pdf;base64,JVBERi...`) |

### Example (partial body)

```json
{
  "title": "Cairo Day Tour",
  "mainImage": "data:image/jpeg;base64,...",
  "file": "data:application/pdf;base64,JVBERi0xLjQK...",
  "categoryId": 1,
  "startDate": "2026-03-01",
  "endDate": "2026-03-15"
}
```

### Response

```json
{
  "message": "Tour Created Successfully"
}
```

---

## Get Tour By ID — `GET /:id`

### Response (new field)

| Field  | Type             | Description                                         |
|--------|------------------|-----------------------------------------------------|
| `file` | `string \| null` | URL to the uploaded document, or `null` if no file attached |

### Example Response (partial)

```json
{
  "id": 1,
  "title": "Cairo Day Tour",
  "mainImage": "https://bcknd.tickethub-tours.com/uploads/tours/abc_123.jpg",
  "file": "https://bcknd.tickethub-tours.com/uploads/tourFiles/def_456.pdf",
  "status": true
}
```

---

## Update Tour — `PUT /:id`

### Request Body (new field)

| Field  | Type              | Required | Description                                           |
|--------|-------------------|----------|-------------------------------------------------------|
| `file` | `string \| null`  | No       | Base64 string to upload a new file, or `null` to remove the existing file |

### Behavior

| Value Sent       | Action                                           |
|------------------|--------------------------------------------------|
| Base64 string    | Old file is deleted from server → new file is saved |
| `null`           | Old file is deleted from server → field is cleared  |
| Field omitted    | No change to the existing file                      |

### Example — Upload new file

```json
{
  "file": "data:application/pdf;base64,JVBERi0xLjQK..."
}
```

### Example — Remove file

```json
{
  "file": null
}
```

### Response

```json
{
  "message": "Tour Updated Successfully"
}
```

---

## Get All Tours — `GET /`

The `file` field is included automatically in each tour object.

---

## Delete Tour — `DELETE /:id`

The associated file (if any) is automatically deleted from the server when a tour is deleted. No additional action is required.

---

## Notes

- **Supported formats:** PDF and other document types. The MIME type is detected from the base64 header.
- **Max file size:** 10 MB (after decoding).
- **Storage path:** Files are saved to `uploads/tourFiles/` on the server.
