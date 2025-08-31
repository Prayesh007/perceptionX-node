# import sys
# import time
# import asyncio
# import base64
# import requests
# from motor.motor_asyncio import AsyncIOMotorClient
# from ultralytics import YOLO
# from PIL import Image
# import numpy as np
# import cv2
# import tempfile
# import subprocess
# import os
# import imageio_ffmpeg as ffmpeg
# from io import BytesIO
# from bson import ObjectId

# # Matplotlib non-GUI setup
# os.environ['MPLCONFIGDIR'] = '/tmp'
# import matplotlib
# matplotlib.use('Agg')
# import matplotlib.pyplot as plt

# # For Ultralytics on Render
# os.environ["ULTRALYTICS_CONFIG_DIR"] = "/tmp/Ultralytics"

# # MongoDB Config
# MONGO_URI = "mongodb+srv://aitools2104:kDTRxzV6MgO4nicA@cluster0.tqkyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tls=true&tlsInsecure=false"
# DATABASE_NAME = "test"
# COLLECTION_NAME = "files"

# # Mongo Connection
# client = AsyncIOMotorClient(MONGO_URI)
# db = client[DATABASE_NAME]
# collection = db[COLLECTION_NAME]

# # YOLO Weights
# weights_path = "./yolov11/best.pt"
# weights_url = "https://your-domain.com/path-to-best.pt"  # Replace this with your actual model file URL

# def load_model():
#     print(f"🔍 Checking if model exists: {weights_path}")
    
#     if not os.path.exists(weights_path):
#         print("⚠️ best.pt not found. Downloading...")
#         try:
#             os.makedirs(os.path.dirname(weights_path), exist_ok=True)
#             response = requests.get(weights_url)
#             with open(weights_path, "wb") as f:
#                 f.write(response.content)
#             print("✅ Model downloaded successfully.")
#         except Exception as e:
#             print(f"❌ Error downloading model: {e}")
#             exit(1)

#     print(f"✅ Model exists at: {weights_path}")
#     model = YOLO(weights_path)
#     print("🧠 YOLO model loaded.")
#     return model

# async def fetch_file_from_mongo(file_id):
#     print(f"🔎 Fetching file from MongoDB ID: {file_id}")
#     try:
#         object_id = ObjectId(file_id)
#     except Exception as e:
#         print(f"❌ Invalid ObjectId: {e}")
#         return None

#     file = await collection.find_one({"_id": object_id})
#     if file and file.get("data"):
#         print(f"📦 File found: {file['filename']}")
#         return file["data"]
#     else:
#         print("❌ File not found or data missing.")
#         return None

# async def process_image(file_id, model):
#     image_data = await fetch_file_from_mongo(file_id)
#     if not image_data:
#         print("❌ No image data to process.")
#         return

#     try:
#         image = Image.open(BytesIO(image_data))
#         image.verify()
#         image = Image.open(BytesIO(image_data)).convert("RGB")
#     except Exception as e:
#         print(f"❌ Image error: {e}")
#         return

#     image_np = np.array(image)
#     results = model(image_np)
#     annotated_image = results[0].plot()

#     _, buffer = cv2.imencode(".jpg", cv2.cvtColor(annotated_image, cv2.COLOR_RGB2BGR))
#     processed_image_binary = buffer.tobytes()

#     await save_processed_file(file_id, processed_image_binary)

# async def process_video(file_id, model):
#     file_data = await fetch_file_from_mongo(file_id)
#     if not file_data:
#         print("❌ No video data found.")
#         return

#     temp_video_path = os.path.join(tempfile.gettempdir(), "temp_video.mp4")
#     with open(temp_video_path, "wb") as f:
#         f.write(file_data)

#     cap = cv2.VideoCapture(temp_video_path)
#     if not cap.isOpened():
#         print("❌ Error opening video.")
#         return

#     total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
#     processed_frames = 0
#     temp_output = os.path.join(tempfile.gettempdir(), "temp_output.avi")

#     fourcc = cv2.VideoWriter_fourcc(*"XVID")
#     fps = int(cap.get(cv2.CAP_PROP_FPS))
#     width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#     height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
#     out = cv2.VideoWriter(temp_output, fourcc, fps, (width, height))

#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             break
#         results = model(frame)
#         annotated_frame = results[0].plot()
#         out.write(annotated_frame)
#         processed_frames += 1
#         print(f"📽️ Processing... {int((processed_frames / total_frames) * 100)}%")

#     cap.release()
#     out.release()

#     processed_video_path = convert_to_mp4(temp_output)
#     with open(processed_video_path, "rb") as f:
#         processed_video_binary = f.read()

#     await save_processed_file(file_id, processed_video_binary)

# def convert_to_mp4(input_file):
#     ffmpeg_command = ffmpeg.get_ffmpeg_exe()
#     output_file = input_file.replace(".avi", ".mp4")
#     command = [ffmpeg_command, "-y", "-i", input_file, "-vcodec", "libx264", "-crf", "23", "-preset", "fast", output_file]
#     subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
#     return output_file

# async def save_processed_file(file_id, processed_data):
#     try:
#         object_id = ObjectId(file_id)
#     except Exception as e:
#         print(f"❌ Invalid ObjectId: {e}")
#         return

#     result = await collection.update_one(
#         {"_id": object_id},
#         {"$set": {"processedData": processed_data}}
#     )

#     # if result.modified_count > 0:
#     #     print(f"✅ Processed data saved to MongoDB for ID: {file_id}")
#     # else:
#     #     print("⚠️ Failed to update document.")
#     if result.modified_count > 0:
#         print(f"✅ Processed file saved to MongoDB for file ID: {file_id}")
#     elif result.matched_count > 0:
#         print("⚠️ Document found, but data was already the same — nothing changed.")
#     else:
#         print("❌ No matching document found. Update failed.")


# if __name__ == "__main__":
#     if len(sys.argv) < 3:
#         print("Usage: python app.py <file_id> <file_type>")
#         sys.exit(1)

#     file_id = sys.argv[1]
#     file_type = sys.argv[2]
#     model = load_model()

#     try:
#         loop = asyncio.get_running_loop()
#     except RuntimeError:
#         loop = asyncio.new_event_loop()
#         asyncio.set_event_loop(loop)

#     if file_type.startswith("image"):
#         loop.run_until_complete(process_image(file_id, model))
#     elif file_type.startswith("video"):
#         loop.run_until_complete(process_video(file_id, model))
#     else:
#         print("❌ Invalid file type. Use 'image' or 'video'.")

# app.py
import sys
import asyncio
import os
import requests
import tempfile
import subprocess
from io import BytesIO
from fastapi import FastAPI


from motor.motor_asyncio import AsyncIOMotorClient
from ultralytics import YOLO
from PIL import Image
import numpy as np
import cv2
from bson import ObjectId
import imageio_ffmpeg as ffmpeg
from bson.binary import Binary

app = FastAPI()  # 👈 This must exist!


# Optional FastAPI service
RUN_AS_SERVICE = os.environ.get("RUN_AS_SERVICE", "false").lower() in ("1", "true", "yes")
FASTAPI_PORT = int(os.environ.get("FASTAPI_PORT", 8000))

# Use tmp for matplotlib config (if matplotlib imported elsewhere)
os.environ['MPLCONFIGDIR'] = '/tmp'
os.environ["ULTRALYTICS_CONFIG_DIR"] = "/tmp/ultralytics"

# Config - prefer environment variables
MONGO_URI = os.environ.get("MONGO_URI", "mongodb+srv://aitools2104:kDTRxzV6MgO4nicA@cluster0.tqkyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tls=true&tlsInsecure=false")
DATABASE_NAME = os.environ.get("DATABASE_NAME", "test")
COLLECTION_NAME = os.environ.get("COLLECTION_NAME", "files")

# Model weights path and optional download URL
WEIGHTS_PATH = os.environ.get("WEIGHTS_PATH", "./yolov11/best.pt")
MODEL_WEIGHTS_URL = os.environ.get("MODEL_WEIGHTS_URL", "")  # optional S3/GDrive URL

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

# global model (loaded once in service mode)
_MODEL = None

# --------------------- MODEL ------------------------
def download_weights_if_missing():
    if os.path.exists(WEIGHTS_PATH):
        print(f"✅ Model exists at: {WEIGHTS_PATH}")
        return True
    if not MODEL_WEIGHTS_URL:
        print(f"❌ Weights not found at {WEIGHTS_PATH} and no MODEL_WEIGHTS_URL provided.")
        return False
    try:
        os.makedirs(os.path.dirname(WEIGHTS_PATH), exist_ok=True)
        print(f"⬇️ Downloading model from {MODEL_WEIGHTS_URL} ...")
        r = requests.get(MODEL_WEIGHTS_URL, stream=True, timeout=60)
        r.raise_for_status()
        with open(WEIGHTS_PATH, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        print("✅ Model downloaded successfully.")
        return True
    except Exception as e:
        print(f"❌ Error downloading model: {e}")
        return False


def load_model():
    global _MODEL
    if _MODEL is not None:
        return _MODEL
    print(f"🔍 Checking if model exists: {WEIGHTS_PATH}")
    if not os.path.exists(WEIGHTS_PATH):
        ok = download_weights_if_missing()
        if not ok:
            print("❌ Cannot load model. Exiting.")
            sys.exit(1)
    _MODEL = YOLO(WEIGHTS_PATH)
    print("🧠 YOLO model loaded.")
    return _MODEL


# --------------------- MONGO HELPERS ------------------------
async def fetch_file_from_mongo(file_id):
    print(f"🔎 Fetching file from MongoDB ID: {file_id}")
    try:
        obj_id = ObjectId(file_id)
    except Exception as e:
        print(f"❌ Invalid ObjectId: {e}")
        return None, None

    try:
        doc = await collection.find_one({"_id": obj_id})
    except Exception as e:
        print(f"❌ MongoDB fetch error: {e}")
        return None, None

    if not doc or "data" not in doc:
        print("❌ File not found or data missing.")
        return None, None

    data = bytes(doc["data"])  # convert Binary → bytes
    mimetype = doc.get("mimetype", "")
    filename = doc.get("filename", "file")
    print(f"📦 File found: {filename} (mimetype: {mimetype}) size={len(data)} bytes")
    return data, mimetype


async def save_processed_file(file_id, processed_bytes):
    try:
        obj_id = ObjectId(file_id)
    except Exception as e:
        print(f"❌ Invalid ObjectId: {e}")
        return False

    try:
        result = await collection.update_one(
            {"_id": obj_id},
            {"$set": {"processedData": Binary(processed_bytes)}}
        )
        if result.modified_count > 0:
            print(f"✅ Processed file saved to MongoDB for file ID: {file_id}")
            return True
        elif result.matched_count > 0:
            print("⚠️ Document found, but processedData unchanged.")
            return True
        else:
            print("❌ No matching document found. Update failed.")
            return False
    except Exception as e:
        print(f"❌ Error updating MongoDB: {e}")
        return False


# --------------------- IMAGE ------------------------
async def process_image(file_id, model):
    image_data, mimetype = await fetch_file_from_mongo(file_id)
    if not image_data:
        return False

    try:
        img = Image.open(BytesIO(image_data)).convert("RGB")
    except Exception as e:
        print(f"❌ Image decode error: {e}")
        return False

    image_np = np.array(img)
    results = model(image_np)
    annotated = results[0].plot()  # RGB ndarray
    try:
        bgr = cv2.cvtColor(annotated, cv2.COLOR_RGB2BGR)
    except Exception:
        bgr = annotated

    success, buffer = cv2.imencode(".jpg", bgr)
    if not success:
        print("❌ cv2.imencode failed.")
        return False

    processed_bytes = buffer.tobytes()
    print("Progress: 100%")
    return await save_processed_file(file_id, processed_bytes)


# --------------------- VIDEO ------------------------
def convert_to_mp4(input_file):
    ffmpeg_exe = ffmpeg.get_ffmpeg_exe()
    output_file = os.path.splitext(input_file)[0] + ".mp4"
    command = [
        ffmpeg_exe, "-y", "-i", input_file,
        "-vcodec", "libx264", "-crf", "23", "-preset", "fast", output_file
    ]
    try:
        subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return output_file
    except Exception as e:
        print(f"❌ FFmpeg conversion failed: {e}")
        return input_file


async def process_video(file_id, model):
    video_data, mimetype = await fetch_file_from_mongo(file_id)
    if not video_data:
        return False

    tmp_in = os.path.join(tempfile.gettempdir(), f"input_{file_id}.mp4")
    with open(tmp_in, "wb") as f:
        f.write(video_data)

    cap = cv2.VideoCapture(tmp_in)
    if not cap.isOpened():
        print("❌ Error opening video.")
        return False

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 1
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    tmp_out = os.path.join(tempfile.gettempdir(), f"out_{file_id}.avi")
    fourcc = cv2.VideoWriter_fourcc(*"XVID")
    out = cv2.VideoWriter(tmp_out, fourcc, fps, (width, height))

    processed_frames = 0
    last_percent = -1
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        results = model(frame)
        annotated = results[0].plot()
        try:
            annotated_bgr = cv2.cvtColor(annotated, cv2.COLOR_RGB2BGR)
        except Exception:
            annotated_bgr = annotated
        out.write(annotated_bgr)

        processed_frames += 1
        percent = int((processed_frames / total_frames) * 100)
        if percent != last_percent and percent % 5 == 0:
            print(f"Progress: {percent}%")
            last_percent = percent

    cap.release()
    out.release()

    mp4_path = convert_to_mp4(tmp_out)
    with open(mp4_path, "rb") as f:
        processed_video = f.read()

    print("Progress: 100%")

    # cleanup
    for p in [tmp_in, tmp_out, mp4_path]:
        try:
            os.remove(p)
        except Exception:
            pass

    return await save_processed_file(file_id, processed_video)


# --------------------- MAIN ------------------------
async def run_process(file_id, file_type):
    model = load_model()
    if file_type.startswith("image"):
        ok = await process_image(file_id, model)
        return ok
    elif file_type.startswith("video"):
        ok = await process_video(file_id, model)
        return ok
    else:
        print("❌ Invalid file type. Use 'image' or 'video'.")
        return False


# CLI mode
async def cli_main():
    if len(sys.argv) < 3:
        print("Usage: python app.py <file_id> <file_type>")
        sys.exit(1)

    file_id = sys.argv[1]
    file_type = sys.argv[2]  # "image" or "video"

    ok = await run_process(file_id, file_type)
    if not ok:
        # non-zero exit codes to indicate error
        sys.exit(2)
    else:
        sys.exit(0)



@app.get("/")
def root():
    return {"message": "YOLO backend is running!"}

    
# FastAPI service mode
if RUN_AS_SERVICE:
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    import uvicorn

    app = FastAPI(title="YOLO Processing Service")

    class ProcessRequest(BaseModel):
        fileId: str
        fileType: str

    @app.on_event("startup")
    async def startup_event():
        # load model once at startup
        load_model()
        print("Service startup complete.")

    @app.post("/process")
    async def process_endpoint(payload: ProcessRequest):
        file_id = payload.fileId
        file_type = payload.fileType
        print(f"API request: process file {file_id} type {file_type}")
        ok = await run_process(file_id, file_type)
        if not ok:
            raise HTTPException(status_code=500, detail="Processing failed")
        return {"status": "ok", "fileId": file_id}

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    if __name__ == "__main__":
        # run uvicorn if executed directly and RUN_AS_SERVICE is true
        uvicorn.run("app:app", host="0.0.0.0", port=FASTAPI_PORT, reload=False)

else:
    if __name__ == "__main__":
        asyncio.run(cli_main())
