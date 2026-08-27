// 1. ตั้งค่า Supabase
const SUPABASE_URL = 'https://wmcplpmmubrofsgqialj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zyXW-H-i2vTOewlb66haNw_oT5c83qX';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. ฟังก์ชันสลับหน้าจอ (UI Routing)
function showSection(sectionId) {
    // ซ่อนทุก section
    document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.remove('active');
    });
    // แสดง section ที่เลือก
    document.getElementById(sectionId).classList.add('active');
}

// 3. ฟังก์ชันจัดรูปแบบเลขบัตรประชาชน (เติม - อัตโนมัติ)
function formatNID(input) {
    let value = input.value.replace(/\D/g, ''); // ลบตัวอักษรที่ไม่ใช่ตัวเลข
    let formatted = '';
    
    if (value.length > 0) formatted += value.substring(0, 1);
    if (value.length > 1) formatted += '-' + value.substring(1, 5);
    if (value.length > 5) formatted += '-' + value.substring(5, 10);
    if (value.length > 10) formatted += '-' + value.substring(10, 12);
    if (value.length > 12) formatted += '-' + value.substring(12, 13);
    
    input.value = formatted;
}

// 4. ตัวอย่างฟังก์ชัน Login นักเรียน (Query จาก Supabase)
async function loginStudent() {
    const stdId = document.getElementById('student-id-login').value;
    const stdNid = document.getElementById('student-nid-login').value.replace(/-/g, ''); // เอา - ออกตอนเช็ค/บันทึก

    if (!stdId || stdId.length !== 5) {
        alert('กรุณากรอกรหัสนักเรียน 5 หลักให้ถูกต้อง');
        return;
    }

    try {
        // ค้นหาข้อมูลจากตาราง data_student (คุณต้องแน่ใจว่าสร้างตารางนี้ใน Supabase แล้ว)
        const { data, error } = await supabase
            .from('data_student')
            .select('*')
            .eq('Student ID/E-mail', stdId)
            .single();

        if (error || !data) {
            alert('ไม่พบข้อมูลนักเรียนในระบบ');
            return;
        }

        // หากพบข้อมูล ให้พาสู่หน้าฟอร์ม และเก็บข้อมูลไว้ใช้
        console.log("เข้าสู่ระบบสำเร็จ:", data);
        
        // เช็คว่าเคยส่งข้อมูลในตาราง 'regis' หรือยัง
        const { data: regisData } = await supabase
            .from('regis')
            .select('*')
            .eq('Studen ID', stdId)
            .single();

        if (regisData) {
            alert('ท่านได้กรอกข้อมูลเรียบร้อยเสร็จสิ้น สถานะ: ' + (regisData.Verification || 'กำลังตรวจสอบ'));
            // ตรงนี้สามารถเขียนโค้ดเพื่อแสดงผลข้อมูลและรูปภาพที่เคยอัปโหลดได้
        } else {
            showSection('student-form');
            // Populate ข้อมูลลงในหน้าฟอร์ม (ดึงรูป, เลขที่, ชื่อ, ชั้น)
        }

    } catch (err) {
        console.error('Error logging in:', err);
    }
}

// 5. ตัวอย่างการบันทึกข้อมูล (ยังไม่รวมการอัปโหลดไฟล์ไป Google Drive)
async function submitStudentData() {
    // โค้ดสำหรับบันทึกลง Supabase ตาราง 'regis'
    alert("จำลองการบันทึกข้อมูล...");
    showSection('main-menu');
}
