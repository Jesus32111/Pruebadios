import express from 'express';
import { body, validationResult } from 'express-validator';
import Warehouse from '../models/Warehouse.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Private
router.get('/', async (req, res) => {
  try {
    console.log('Getting all warehouses for user:', req.user._id);
    console.log('Query parameters:', req.query);
    
    const { status, department, search } = req.query;
    let query = { createdBy: req.user._id };

    // Add filters
    if (status && status !== 'all') {
      query.status = status;
      console.log('Filtering by status:', status);
    }
    if (department && department !== 'all') {
      query.department = department;
      console.log('Filtering by department:', department);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { manager: { $regex: search, $options: 'i' } }
      ];
      console.log('Filtering by search:', search);
    }

    console.log('Final query:', JSON.stringify(query, null, 2));

    const warehouses = await Warehouse.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${warehouses.length} warehouses`);

    res.status(200).json({
      success: true,
      count: warehouses.length,
      data: warehouses
    });
  } catch (error) {
    console.error('Get warehouses error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching warehouses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get single warehouse
// @route   GET /api/warehouses/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    console.log('Getting warehouse with ID:', req.params.id);
    console.log('User ID:', req.user._id);
    
    const warehouse = await Warehouse.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    }).populate('createdBy', 'name email');

    if (!warehouse) {
      console.log('Warehouse not found');
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    console.log('Warehouse found:', warehouse._id);

    res.status(200).json({
      success: true,
      data: warehouse
    });
  } catch (error) {
    console.error('Get warehouse error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching warehouse',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Create new warehouse
// @route   POST /api/warehouses
// @access  Private
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name is required and must be less than 100 characters'),
  body('address')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Address is required and must be less than 200 characters'),
  body('department')
    .isIn([
      'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
      'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
      'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios',
      'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
    ])
    .withMessage('Invalid department'),
  body('capacity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Capacity must be a positive number'),
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    console.log('Creating new warehouse:', req.body);
    console.log('User ID:', req.user._id);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Create warehouse
    const warehouseData = {
      ...req.body,
      createdBy: req.user._id
    };

    console.log('Creating warehouse with data:', warehouseData);

    const warehouse = new Warehouse(warehouseData);
    const savedWarehouse = await warehouse.save();
    
    // Populate the created warehouse
    await savedWarehouse.populate('createdBy', 'name email');
    
    console.log('Warehouse created successfully:', savedWarehouse._id);

    res.status(201).json({
      success: true,
      data: savedWarehouse
    });
  } catch (error) {
    console.error('Create warehouse error:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating warehouse',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update warehouse
// @route   PUT /api/warehouses/:id
// @access  Private
router.put('/:id', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Address must be less than 200 characters'),
  body('department')
    .optional()
    .isIn([
      'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
      'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
      'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios',
      'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
    ])
    .withMessage('Invalid department'),
  body('capacity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Capacity must be a positive number'),
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    console.log('Updating warehouse:', req.params.id, req.body);
    console.log('User ID:', req.user._id);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const warehouse = await Warehouse.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    console.log('Warehouse updated successfully');

    res.status(200).json({
      success: true,
      data: warehouse
    });
  } catch (error) {
    console.error('Update warehouse error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating warehouse',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Delete warehouse
// @route   DELETE /api/warehouses/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting warehouse:', req.params.id);
    console.log('User ID:', req.user._id);
    
    const warehouse = await Warehouse.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    console.log('Warehouse deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Warehouse deleted successfully'
    });
  } catch (error) {
    console.error('Delete warehouse error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting warehouse',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;