import Arsip from "../models/ArsipModel.js";
import Data from "../models/DataModel.js";
import { Op } from "sequelize"
import path from "path";
import fs from "fs";

export const getArsip = async (req, res) => {
  try {
    const arsip = await Arsip.findAll({
      include: [{
        model: Data,
        as: "Data"
      }]
    })
    res.status(200).json(arsip);
  } catch (error) {
    res.status(500).json({msg: error.message})
  }
};

export const getArsipById = async (req, res) => {
  try {
    const response = await Arsip.findOne({
      where: {
        idArsip: req.params.idArsip,
      },
      include: [{
        model: Data,
        as: "Data"
      }]
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createArsip = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  try {
    const existingArsipCount = await Arsip.count({
      where: {
        createdAt: {
          [Op.ne]: null, // Menghindari null values (createdAt sudah ada)
        },
      },
    });

    const idArsip = `ARSIP${(existingArsipCount + 1).toString().padStart(3, '0')}`;
    const idData = req.body.idData;
    const namaFile = req.body.namaFile;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;
    const allowedType = [".pdf", ".docx", ".doc", ".pptx", ".ppt", ".xlsx", ".xls"];

    const tipeFile = ext.toLowerCase();

    if (!allowedType.includes(tipeFile))
      return res.status(422).json({ msg: "Invalid File" });
    if (fileSize > 10000000)
      return res.status(422).json({ msg: "File must be less than 10 MB" });

    file.mv(`./public/files/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        await Arsip.create({
          idArsip: idArsip,
          idData: idData,
          namaFile: namaFile,
          tipeFile: tipeFile,
          files: fileName,
          url: url,
        });
        res.status(201).json({ msg: "Arsip Created Successfuly" });
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {}
};

export const updateArsip = async (req, res) => {
  const arsip = await Arsip.findOne({
    where: {
      idArsip: req.params.idArsip,
    },
  });
  if (!arsip) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  let tipeFile = arsip.tipeFile; // Menyimpan tipeFile dari data sebelumnya

  if (req.files === null) {
    fileName = arsip.files;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".pdf", ".docx", ".doc", ".pptx", ".ppt", ".xlsx", "xls"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid files" });
    if (fileSize > 10000000)
      return res.status(422).json({ msg: "File must be less than 10 MB" });

    const filepath = `./public/files/${arsip.files}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/files/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });

    // Mengubah tipeFile berdasarkan ekstensi file yang baru diupload
    tipeFile = ext.toLowerCase();
  }

  const idData = req.body.idData;
  const namaFile = req.body.namaFile;
  const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;

  try {
    await Arsip.update(
      {
        idData: idData,
        namaFile: namaFile,
        tipeFile: tipeFile, // Menggunakan tipeFile yang telah diubah
        files: fileName,
        url: url,
      },
      {
        where: {
          idArsip: req.params.idArsip,
        },
      }
    );
    res.status(200).json({ msg: "Arsip Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteArsip = async (req, res) => {
  try {
    const arsip = await Arsip.findOne({
      where: {
        idArsip: req.params.idArsip,
      },
    });

    if (!arsip) {
      return res.status(404).json({ msg: "Arsip Not Found" });
    }

    const filePath = `./public/files/${arsip.files}`;

    fs.unlink(filePath, async (err) => {
      await arsip.destroy();
      res.status(200).json({ msg: "Arsip Deleted" });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
