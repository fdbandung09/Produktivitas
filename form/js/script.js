document.addEventListener("DOMContentLoaded", function () {
  const btnKirim = document.querySelector(".btn-kirim");
  const btnLoading = document.querySelector(".btn-loading");
  const namaKoor = [
    "Ilham Putra Pratama",
    "Roni Suharyanto",
    "Kiki Purnama",
    "Reyza Abdurrozaq",
    "Mas Gilang Ginanjar",
    "Johan Safarisa Sidik",
    "Vidya Nirmala Putri",
  ];

  // Ambil nama dan nrp dari localStorage
  var namaPekerja = localStorage.getItem("namaPekerja");
  var nrpPekerja = localStorage.getItem("nrpPekerja");

  // Tampilkan nama pekerja di dashboard
  document.getElementById("namaPekerja").textContent = namaPekerja;

  function hitungJamKerja(jamMulai, jamSelesai, bagian) {
    let jamKerja;

    if (bagian === "Istirahat") {
      jamKerja = 1;
    } else if (bagian === "Break") {
      jamKerja = 0.25; // 15 menit adalah 0.25 jam
    } else {
      const mulai = new Date(`1970-01-01T${jamMulai}:00`);
      const selesai = new Date(`1970-01-01T${jamSelesai}:00`);

      let selisih = selesai - mulai;

      if (selesai < mulai) {
        selesai.setDate(selesai.getDate() + 1);
        selisih = selesai - mulai;
      }

      jamKerja = selisih / (1000 * 60 * 60);
    }

    return jamKerja;
  }

  // Menangani pengiriman form produktifitas
  document
    .getElementById("productivityForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Mencegah pengiriman form

      // Tampilkan tombol loading
      btnKirim.classList.add("d-none");
      btnLoading.classList.remove("d-none");

      // Ambil data dari form
      var Aktifitas = document.getElementById("Aktifitas").value;
      var date = document.getElementById("date").value;
      var task = document.getElementById("task").value;
      var jamMulai = document.getElementById("jamMulai").value;
      var jamSelesai = document.getElementById("jamSelesai").value;

      console.log("Form data:", {
        namaPekerja,
        nrpPekerja,
        Aktifitas,
        date,
        task,
        jamMulai,
        jamSelesai,
      });

      // Hitung jam kerja
      let hours = hitungJamKerja(jamMulai, jamSelesai, Aktifitas);
      console.log("Hours calculated:", hours);

      // Pilih bagian dan koordinator
      let bagian = "";
      switch (Aktifitas) {
        case "Inventory":
        case "Procurement":
        case "Supply Operation":
        case "BO Monitoring":
          bagian = "Inventory";
          break;
        case "Claim Customer to Depo":
        case "Claim Depo to TAM":
          bagian = "Claim";
          break;
        case "Unloading":
        case "Checking Receiving":
        case "Binning":
        case "Cleansing Receiving":
          bagian = "Receiving";
          break;
        case "Reserve":
        case "Replenishment":
        case "Relocation":
        case "Trouble Shooter":
        case "Maintain Location":
        case "Maintain F":
          bagian = "Storage";
          break;
        case "Picking Issuing":
        case "Checking Issuing":
        case "Packaging Preparation":
        case "Packing":
        case "Picking - Checking - Packing (PCP)":
        case "Cleansing Issuing":
        case "Billing":
          bagian = "Issuing";
          break;
        case "Loading":
        case "Shipping Monitoring":
        case "Monitoring Shipping Document":
          bagian = "Shipping";
          break;
        case "Quality":
          bagian = "Quality";
          break;
        case "HSE":
        case "GA":
          bagian = "HSE & GA";
          break;
        case "Administrasi":
        case "HR":
        case "Daily Report":
        case "Weekly Report":
        case "Monthly Report":
        case "Quarter Report":
        case "Mid Year Report":
        case "Yearly Report":
          bagian = "Administrasi";
          break;
        default:
          bagian = "Lainnya";
          break;
      }

      let koordinator = "";
      switch (bagian) {
        case "Inventory":
          koordinator = namaKoor[0];
          break;
        case "Claim":
          koordinator = namaKoor[0];
          break;
        case "Receiving":
          koordinator = namaKoor[1];
          break;
        case "Storage":
          koordinator = namaKoor[2];
          break;
        case "Issuing":
          koordinator = namaKoor[3];
          break;
        case "Shipping":
          koordinator = namaKoor[4];
          break;
        case "Quality":
          koordinator = namaKoor[5];
          break;
        case "HSE & GA":
          koordinator = namaKoor[5];
          break;
        case "Administrasi":
          koordinator = namaKoor[6];
          break;
        default:
          koordinator = "Koordinator tidak diketahui";
          break;
      }

      // Kirim data ke Google Sheets
      fetch(
        "https://script.google.com/macros/s/AKfycby3xkcJjwoi5dr3veIAKZf3J98kJcUpvyv7u6jXM-jL74G95qdXzkjmriO8qxLsHwQKSA/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama: namaPekerja,
            nrp: nrpPekerja,
            date: date,
            Aktifitas: Aktifitas,
            bagian: bagian,
            task: task,
            jamMulai: jamMulai,
            jamSelesai: jamSelesai,
            koor: koordinator,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Response data:", data);
          // Tampilkan tombol kirim
          btnKirim.classList.remove("d-none");
          btnLoading.classList.add("d-none");
          alert("Data berhasil dikirim!");
          document.getElementById("productivityForm").reset();
        })
        .catch((error) => {
          console.error("Error:", error);
          // Tampilkan tombol kirim
          btnKirim.classList.remove("d-none");
          btnLoading.classList.add("d-none");
          alert("Terjadi kesalahan, silakan coba lagi.");
        });
    });
});
