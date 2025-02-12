import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegistrationForm = () => {
  const initialFormState = {
    name: '',
    phone: '',
    email: '',
    house: '',
    place: '',
    post: '',
    pincode: '',
    district: '',
    state: '',
    father_name: '',
    mother_name: '',
    aadhaar: '',
    gender: '',
    marital_status: false,
    dob: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ type: '', message: '' });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (formData.aadhaar && !formData.aadhaar.match(/^\d{12}$/)) {
      newErrors.aadhaar = 'Aadhaar should be 12 digits';
    }
    
    if (formData.pincode && !formData.pincode.match(/^\d{6}$/)) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = validateForm();
		
		// Format the data in the desired structure
		const formattedData = {
			
		};
	
		// Log the formatted data
		console.log('Formatted Form Data:');
		Object.entries(formattedData).forEach(([key, value]) => {
			console.log(`${key} (${typeof value}): ${value}`);
		});
		Object.entries(formattedData).forEach(([key, value]) => {
			console.log(`${key}: ${value}`);
		});
		
		if (Object.keys(newErrors).length === 0) {
			try {
				const response = await fetch('https://api.sirajulhuda.com/api/v1/staff/otr/create', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						'name': formData.name,
						'phone': formData.phone,
						'email': formData.email,
						'house': formData.house,  
						'place': formData.place,
						'post': formData.post,
						'pincode': formData.pincode,
						'district': formData.district,
						'state': formData.state,
						'father_name': formData.father_name,
						'mother_name': formData.mother_name,
						'aadhaar': formData.aadhaar,
						'gender': formData.gender,
						'marital_status': formData.marital_status,
						'dob': formData.dob ? new Date(formData.dob).toISOString().slice(0, 19).replace('T', ' ') : null,
					})  
				});
	
				if (response.ok) {
					const responseData = await response.json();
					setNotification({
						type: 'success',
						message: 'Registration successful!'
					});
					setFormData(initialFormState);
				} else {
					const errorData = await response.json();
					setNotification({
						type: 'danger',
						message: errorData.message || 'Registration failed. Please try again.'
					});
				}
			} catch (error) {
				console.error('API Error:', error);
				setNotification({
					type: 'danger',
					message: 'Network error occurred. Please try again.'
				});
			}
		} else {
			setErrors(newErrors);
		}
	};

  return (
    <div className="home-bg">
      {notification.message && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
          {notification.message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setNotification({ type: '', message: '' })}
          ></button>
        </div>
      )}

      <div className="top-main-box">
        <div className="otr-form">
					<h4 className="text-otr">Application for One Time Registration</h4>
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  required
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  required
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">House</label>
                <input
                  type="text"
                  name="house"
                  value={formData.house}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Place</label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Post</label>
                <input
                  type="text"
                  name="post"
                  value={formData.post}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                />
                {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Family Information */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Father's Name</label>
                <input
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Mother's Name</label>
                <input
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  className={`form-control ${errors.aadhaar ? 'is-invalid' : ''}`}
                />
                {errors.aadhaar && <div className="invalid-feedback">{errors.aadhaar}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  name="marital_status"
                  checked={formData.marital_status}
                  onChange={handleChange}
                  className="form-check-input"
                  id="maritalStatus"
                />
                <label className="form-check-label" htmlFor="maritalStatus">
                  Married
                </label>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => setFormData(initialFormState)}
                className="btn btn-secondary"
              >
                Clear Fields
              </button>
              <button type="submit" className="btn btn-submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default RegistrationForm;	