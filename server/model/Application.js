const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    // Đơn của sinh viên nào?
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicationType: {
        type: String,
        enum: [
            'attendance_exemption',                    
            'transcript_request',                      
            'credit_transfer',                         
            'course_switch',                          
            'grade_review',                           
            'improvement_exam',                        
            'other_applications',                     
            'withdrawal_request',                      
            'major_transfer',                        
            'campus_transfer',                       
            'online_course_assessment',              
            'money_withdrawal',                      
            'course_transfer_refund',                
            'attendance_complaint',                
            'topj_registration',                   
            'readmission_request',                  
            'luk_attendance_support',               
            'specialized_combo_change',                
            'early_graduation',                      
            'thesis_postponement',                
            'course_withdrawal',                
            'leave_of_absence',              
            'suspension'
        ],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // Người xử lý đơn (Admin/Teacher)
    processedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);