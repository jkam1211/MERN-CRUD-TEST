/**
 * The controller to handle the businesses
 */

const Business = require('../models/Business');
const {
  ERROR,
  EMAIL_ALREADY_EXISTED,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE
} = require('../utils/constants');

/**
 * Create a new business and get the first 20 businesses
 * @param {object} req
 * @param {object} res
 * @returns response
 */
exports.create = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      phone,
      email,
      openTime,
      closeTime
    } = req.body;
    let logo = '';
    let pictures = [];

    if (req.files.logo) {
      logo = req.files.logo[0].filename;
    }
    if (req.files.pictures) {
      pictures = req.files.pictures.map((picture) => picture.filename);
    }

    // Confirm if a business that has the same email is already existed.
    const existedEmail = await Business.findOne({ email });
    if (existedEmail) {
      return res.status(400).send(EMAIL_ALREADY_EXISTED);
    } else {
      await new Business({
        name,
        description,
        address,
        phone,
        email,
        openTime,
        closeTime,
        logo,
        pictures
      }).save();

      await Business.find()
        .sort({ name: 1 })
        .skip(DEFAULT_PAGE_SIZE * (DEFAULT_PAGE_NUMBER - 1))
        .limit(DEFAULT_PAGE_SIZE)
        .then((results) => res.status(200).json(results));
    }
  } catch (error) {
    return res.status(500).send(ERROR);
  }
};

/**
 * Get the business by page size and page number
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const { pageSize, pageNumber } = req.body;
    console.log(req.body);
    let expectedBusinessesAmount;
    if (pageNumber == 1) {
      expectedBusinessesAmount = await Business.find().count();
    }
    const businesses = await Business.find()
      .sort({ name: 1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);
    console.log(businesses[0].name);
    return res.status(200).json({ businesses, expectedBusinessesAmount });
  } catch (error) {
    return res.status(500).send(ERROR);
  }
};

/**
 * Update a business and get the first 20 businesses
 * @param {object} req
 * @param {object} res
 * @returns response
 */
exports.updateById = async (req, res) => {
  try {
    const { _id } = req.params;
    const {
      name,
      description,
      address,
      phone,
      email,
      openTime,
      closeTime
    } = req.body;
    let logo = req.body.logo ? req.body.logo : '';
    let pictures = req.body.pictures ? req.body.pictures : [];

    if (!pictures instanceof Array) {
      pictures = req.body.pictures.split(', ');
    }

    if (req.files.logo) {
      logo = req.files.logo[0].filename;
    }
    if (req.files.pictures) {
      let filePictures = req.files.pictures.map((picture) => picture.filename);
      pictures.push(...filePictures);
    }

    // Confirm if a business that has the same email is already existed.
    const existedEmails = await Business.find({ email });
    if (existedEmails.length > 1) {
      return res.status(400).send(EMAIL_ALREADY_EXISTED);
    } else {
      await Business.findByIdAndUpdate(_id, {
        name,
        description,
        address,
        phone,
        email,
        openTime,
        closeTime,
        logo,
        pictures
      });
      await Business.find()
        .sort({ name: 1 })
        .skip(DEFAULT_PAGE_SIZE * (DEFAULT_PAGE_NUMBER - 1))
        .limit(DEFAULT_PAGE_SIZE)
        .then((results) => res.status(200).json(results));
    }
  } catch (error) {
    return res.status(500).send(ERROR);
  }
};

/**
 * Delete a business by its object id and get the first 20 businesses
 * @param {object} req
 * @param {object} res
 */
exports.deleteById = async (req, res) => {
  try {
    const { _id } = req.params;
    await Business.findByIdAndDelete(_id);
    await Business.find()
      .sort({ name: 1 })
      .skip(DEFAULT_PAGE_SIZE * (DEFAULT_PAGE_NUMBER - 1))
      .limit(DEFAULT_PAGE_SIZE)
      .then((results) => res.status(200).json(results));
  } catch (error) {
    return res.status(500).send(ERROR);
  }
};

// exports.searchByName = (req, res) => {
//   console.log(req.body);
// };

/**
 * Insert 210 mock businesses into the mongodb
 * @param {object} req
 * @param {object} res
 */
exports.insertMockData = async (req, res) => {
  for (let i = 1; i <= 210; i += 1) {
    let phone = '+';
    for (let j = 0; j < 10; j += 1) {
      phone = phone + Math.floor(Math.random() * 9);
    }
    await new Business({
      name: `Blue Business ${i}`,
      description: `This is Blue Business ${i}. We are always available for you. We can support you to drive your dream up. Please contact us.`,
      address: `Blue Area ${i}`,
      phone,
      email: `blue.business.${i}@gmail.com`,
      openTime: '09:00',
      closeTime: '18:00'
    }).save();
    await console.log(i);
  }
  await console.log('Done');
};
