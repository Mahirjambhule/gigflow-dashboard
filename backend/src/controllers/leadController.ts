import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';


export const createLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Extract Query Parameters (with defaults for pagination)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { status, source, search, sort } = req.query;

    // 2. Build the Query Object dynamically
    const queryObj: any = {};

    // Filter by Status
    if (status) {
      queryObj.status = status;
    }

    // Filter by Source
    if (source) {
      queryObj.source = source;
    }

    // Search by Name or Email (Case-insensitive Regex)
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // 3. Determine Sort Order
    // If sort === 'Oldest', ascend (1). Otherwise, default to 'Latest' descending (-1).
    const sortOrder = sort === 'Oldest' ? 1 : -1;

    // 4. Execute Query with Pagination and Sorting
    const leads = await Lead.find(queryObj)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit);

    // 5. Get Total Count for Pagination Metadata
    const totalLeads = await Lead.countDocuments(queryObj);

    // 6. Send Response
    res.status(200).json({
      leads,
      pagination: {
        total: totalLeads,
        page,
        pages: Math.ceil(totalLeads / limit),
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }
    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true 
    });

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }
    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }
    res.status(200).json({ message: 'Lead removed successfully' });
  } catch (error) {
    next(error);
  }
};