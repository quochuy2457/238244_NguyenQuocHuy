exports.getDevices = async (req, res, next) => {
  try {
    const search = req.query.search?.trim() || "";
    const filter = {};

    if (search) {
      const escaped = search.replace(
        /[.*+?^${}()|[\]\\]/g, "\\$&"
      );

      const regex = {
        $regex: escaped,
        $options: "i"
      };

      filter.$or = [
        { deviceId: regex },
        { name: regex },
        { deviceType: regex },
        { room: regex },
        { brand: regex },
        { model: regex }
      ];
    }

    const devices = await Device.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      total: devices.length,
      data: devices
    });

  } catch (error) {
    next(error);
  }
};
exports.getDeviceById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "ID thiết bị không hợp lệ"
      });
    }

    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thiết bị"
      });
    }

    res.status(200).json({
      success: true,
      data: device
    });

  } catch (error) {
    next(error);
  }
};
exports.createDevice = async (req, res, next) => {
  try {
    const device = await Device.create(req.body);

    res.status(201).json({
      success: true,
      message: "Thêm thiết bị thành công",
      data: device
    });

  } catch (error) {
    next(error);
  }
};
exports.updateDevice = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "ID thiết bị không hợp lệ"
      });
    }

    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
        context: "query"
      }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thiết bị"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thiết bị thành công",
      data: device
    });

  } catch (error) {
    next(error);
  }
};
exports.deleteDevice = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "ID thiết bị không hợp lệ"
      });
    }

    const device = await Device.findByIdAndDelete(
      req.params.id
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thiết bị"
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa thiết bị thành công"
    });

  } catch (error) {
    next(error);
  }
};