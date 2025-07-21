function renderPills(type, count) {
  const colorClass = type === 2 ? "pill-2mg" : "pill-3mg";
  let pillsHTML = "";
  for (let i = 0; i < count; i++) {
    pillsHTML += `<span class="pill ${colorClass}"></span>`;
  }
  return pillsHTML;
}

function calculate() {
  const inr = parseFloat(document.getElementById("inr").value);
  const bleeding = document.getElementById("bleeding").value;
  const weeklyDose = parseFloat(document.getElementById("weeklyDose").value);
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const resultDiv = document.getElementById("result");

  if (isNaN(weeklyDose) || (mode === "auto" && isNaN(inr))) {
    resultDiv.innerHTML = "กรุณากรอกข้อมูลให้ครบ";
    return;
  }

  let advice = "";
  let percentChange = 0;

  if (mode === "manual") {
    percentChange = parseFloat(document.getElementById("manualPercent").value);
    advice = `ผู้ใช้เลือกเปลี่ยนขนาดยา ${percentChange > 0 ? "+" : ""}${(percentChange * 100).toFixed(0)}%`;
  } else {
    if (bleeding === "yes") {
      advice = "ให้ Vitamin K₁ 10 mg IV + FFP และให้ซ้ำทุก 12 ชม. หากจำเป็น";
      percentChange = -1.0;
    } else if (inr < 1.5) {
      advice = "เพิ่มขนาดยา 10–20%";
      percentChange = 0.15;
    } else if (inr < 2.0) {
      advice = "เพิ่มขนาดยา 5–10%";
      percentChange = 0.075;
    } else if (inr <= 3.0) {
      advice = "ให้ขนาดยาเท่าเดิม";
      percentChange = 0;
    } else if (inr <= 3.9) {
      advice = "ลดขนาดยา 5–10%";
      percentChange = -0.075;
    } else if (inr <= 4.9) {
      advice = "หยุดยา 1 วัน แล้วลดขนาดยา 10%";
      percentChange = -0.1;
    } else if (inr < 9.0) {
      advice = "หยุดยา 1–2 ครั้ง + ให้ Vitamin K₁ 1 mg oral";
      percentChange = -0.2;
    } else {
      advice = "ให้ Vitamin K₁ 5–10 mg oral";
      percentChange = -0.3;
    }
  }

  const newWeekly = weeklyDose * (1 + percentChange);
  const daily = newWeekly / 7;
  const dosePlan = calculateTabletPlan(newWeekly);

  const pills2 = renderPills(2, dosePlan[2]);
  const pills3 = renderPills(3, dosePlan[3]);

  resultDiv.innerHTML = `
    <b>คำแนะนำ:</b> ${advice}<br>
    <b>ขนาดยาใหม่ต่อสัปดาห์ (mg):</b> ${newWeekly.toFixed(2)}<br>
    <b>เฉลี่ยต่อวัน:</b> ${daily.toFixed(2)} mg<br>
    <div class="pill-container">
      ▸ Warfarin 2 mg × ${dosePlan[2]} เม็ด<br>
      ${pills2}<br><br>
      ▸ Warfarin 3 mg × ${dosePlan[3]} เม็ด<br>
      ${pills3}
    </div>
  `;
}
