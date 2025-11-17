import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

const TB_IP = "192.168.8.31:16676";
const USERNAME = "admin";
const PASSWORD = "123456";
const BASE = `http://${TB_IP}/terminal/core/v1`;
const SOLUTION_PATH = path.resolve("config/solution.json");

let TOKEN = null;
const H = () => ({
  // "X-Auth-Token": TOKEN
  "Authorization": TOKEN
  // "Authorization": `Bearer ${TOKEN}`
});

// 1 - Login
// POST /terminal/core/v1/user/login
// POST /terminal/screen/v1/user/login
// POST /terminal/user/login

async function login() {
  const { data } = await axios.post(
    `http://${TB_IP}/terminal/core/v1/user/login`,
    { username: USERNAME, password: PASSWORD },
    { headers: { "Content-Type": "application/json" } }
  );
  TOKEN = data.token;
  console.log("[test] - 1.  Đăng nhập thành công");
}

// 2 - Kiểm tra / đặt Async mode
async function ensureAsync() {
  const { data } = await axios.get(`${BASE}/workmode`, { headers: H() });
  if (data.mode !== "async") {
    console.log("[test] - 2. Đặt workmode = async ...");
    const res = await axios.post(`${BASE}/workmode`, { mode: "async" }, { headers: H() });
    console.log('[test] - -- workmode response: ', res.data)
    console.log("[test] - -- Thiết bị chuyển sang async, chờ khởi động lại...");
    await new Promise(r => setTimeout(r, 10000));
  } else {
    console.log("🎛  TB10 Plus đang ở async mode");
  }
}
// 3 - change volume 
async function changeVolume(level) {
  const payload = { ratio: level };
  try {
    console.log(`[test] - Đặt volume = ${level}% ...`);
    const { data } = await axios.get(`${BASE}/device/volume`, { payload, headers: H()  });
    console.log("[test] - Volume response:", JSON.stringify(data, null, 2));
    return data;

  } catch (err) {
    console.error("[test] - Lỗi đặt volume:", err.response?.data || err.message);
    throw err;
  }
}


// 3 - Upload file media
async function uploadMedia(localFile) {
  const filePath = path.resolve(localFile);
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  console.log(`[test] - 3. Uploading ${localFile} ...`);
  const { data } = await axios.post(`${BASE}/file/upload`, form, {
    headers: { ...form.getHeaders(), ...H() },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });

  // dữ liệu trả về thường có uri/path/id
  const uri = data.uri || data.path;
  if (!uri) throw new Error("Thiết bị không trả về uri/path sau khi upload");
  console.log(`✅ Upload thành công → ${uri}`);
  return uri;
}

// 4 - Đẩy solution / program
async function pushSolution(solution) {
  const payload = {
    program: {
      name: solution.programName,
      widgets: solution.widgets
    }
  };
  console.log("🚀 Đẩy solution lên thiết bị ...");
  const { status } = await axios.post(`${BASE}/program`, payload, {
    headers: { "Content-Type": "application/json", ...H() },
    timeout: 10000
  });
  if (status === 200) console.log("✅ Solution gửi thành công!");
  else console.warn("⚠️ Lỗi khi đẩy solution:", status);
}

// 5 - Chạy workflow
(async () => {
  try {
    const solution = JSON.parse(fs.readFileSync(SOLUTION_PATH, "utf8"));
    await login();
    // await ensureAsync();
    await changeVolume("70%");

    // Upload từng file media, thay localFile bằng uri
    // for (const w of solution.widgets) {
    //   if (w.localFile) {
    //     const uri = await uploadMedia(w.localFile);
    //     delete w.localFile;
    //     w.uri = uri;
    //   }
    // }

    // await pushSolution(solution);
    // console.log("🏁 Hoàn tất workflow ViPlex: upload + program.");
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
  }
})();
