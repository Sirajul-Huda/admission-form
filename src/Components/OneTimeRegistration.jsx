import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://api.sirajulhuda.com';

// Free-text fields saved in UPPERCASE regardless of how they are typed.
const UPPERCASE_FIELDS = [
	'name', 'house', 'place', 'post', 'district', 'state',
	'father_name', 'mother_name', 'spouse_name'
];

// Fields kept as "+91" followed by up to 10 digits.
const PHONE_FIELDS = ['phone', 'whatsapp'];

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const toUpper = (value) => {
	const trimmed = (value || '').trim();
	return trimmed ? trimmed.toUpperCase() : null;
};

const toApiDate = (value) => (value ? `${value} 00:00:00` : null);

const RegistrationForm = () => {
	const initialFormState = {
		name: '',
		phone: '+91',
		whatsapp: '+91',
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
		marital_status: '',
		spouse_name: '',
		dob: '',
		appointment_date: '',
		institution_id: ''
	};

	const [formData, setFormData] = useState(initialFormState);
	const [errors, setErrors] = useState({});
	const [notification, setNotification] = useState({ type: '', message: '' });
	const [institutions, setInstitutions] = useState([]);
	const [photo, setPhoto] = useState(null);
	const [photoPreview, setPhotoPreview] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const photoInputRef = useRef(null);

	useEffect(() => {
		const loadInstitutions = async () => {
			try {
				const response = await fetch(`${API_BASE}/api/v1/staff/otr/institutions`);
				if (response.ok) {
					const result = await response.json();
					setInstitutions(result.data || []);
				}
			} catch (error) {
				console.error('Error fetching institutions:', error);
			}
		};
		loadInstitutions();
	}, []);

	useEffect(() => {
		if (!photo) {
			setPhotoPreview(null);
			return undefined;
		}
		const url = URL.createObjectURL(photo);
		setPhotoPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [photo]);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name.trim()) newErrors.name = 'Name is required';
		if (!formData.phone.match(/^\+91\d{10}$/)) {
			newErrors.phone = 'Enter a valid 10-digit phone number with country code (+91)';
		}
		if (formData.whatsapp !== '+91' && !formData.whatsapp.match(/^\+91\d{10}$/)) {
			newErrors.whatsapp = 'Enter a valid 10-digit WhatsApp number, or leave it empty';
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			newErrors.email = 'Enter a valid email address';
		}

		// Aadhaar validation removed

		if (formData.pincode && !formData.pincode.match(/^\d{6}$/)) {
			newErrors.pincode = 'Enter a valid 6-digit pincode';
		}

		return newErrors;
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (PHONE_FIELDS.includes(name)) {
			// Ensure the number always starts with +91
			if (!value.startsWith('+91')) {
				return; // Prevent removing +91
			}
			// Only allow digits after +91
			const phoneNumber = value.replace(/[^\d]/g, '');
			setFormData(prev => ({
				...prev,
				[name]: '+91' + phoneNumber.slice(2, 12) // Limit to 10 digits after +91
			}));
		} else if (UPPERCASE_FIELDS.includes(name)) {
			setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
		} else {
			setFormData(prev => ({
				...prev,
				[name]: type === 'checkbox' ? checked : value
			}));
		}
	};

	const handlePhotoChange = (e) => {
		const file = e.target.files && e.target.files[0];
		setErrors(prev => ({ ...prev, photo: undefined }));
		if (!file) {
			setPhoto(null);
			return;
		}
		if (!/\.(jpe?g|png)$/i.test(file.name)) {
			setErrors(prev => ({ ...prev, photo: 'Upload a JPG or PNG photo' }));
			e.target.value = '';
			setPhoto(null);
			return;
		}
		if (file.size > MAX_PHOTO_BYTES) {
			setErrors(prev => ({ ...prev, photo: 'Photo must be smaller than 5 MB' }));
			e.target.value = '';
			setPhoto(null);
			return;
		}
		setPhoto(file);
	};

	const resetForm = () => {
		setFormData(initialFormState);
		setErrors({});
		setPhoto(null);
		if (photoInputRef.current) photoInputRef.current.value = '';
	};

	const uploadPhoto = async (otrId) => {
		const body = new FormData();
		body.append('document', photo);
		const response = await fetch(`${API_BASE}/api/v1/staff/otr/upload-image/${otrId}`, {
			method: 'POST',
			body
		});
		return response.ok;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = validateForm();

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		setErrors({});

		const isMarried = formData.marital_status === 'yes';
		const payload = {
			'name': toUpper(formData.name),
			'phone': formData.phone,
			'whatsapp': formData.whatsapp === '+91' ? null : formData.whatsapp,
			'email': formData.email.trim(),
			'house': toUpper(formData.house),
			'place': toUpper(formData.place),
			'post': toUpper(formData.post),
			'pincode': formData.pincode,
			'district': toUpper(formData.district),
			'state': toUpper(formData.state),
			'father_name': toUpper(formData.father_name),
			'mother_name': toUpper(formData.mother_name),
			'aadhaar': formData.aadhaar,
			'gender': formData.gender,
			'marital_status': formData.marital_status === '' ? null : isMarried,
			'spouse_name': isMarried ? toUpper(formData.spouse_name) : null,
			'dob': toApiDate(formData.dob),
			'appointment_date': toApiDate(formData.appointment_date),
			'institution_id': formData.institution_id ? Number(formData.institution_id) : null,
		};

		setSubmitting(true);
		try {
			const response = await fetch(`${API_BASE}/api/v1/staff/otr/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				const responseData = await response.json();
				let photoFailed = false;
				if (photo && responseData.id) {
					try {
						photoFailed = !(await uploadPhoto(responseData.id));
					} catch (uploadError) {
						console.error('Photo upload error:', uploadError);
						photoFailed = true;
					}
				}
				setNotification(photoFailed ? {
					type: 'warning',
					message: 'Registration successful, but the photo could not be uploaded. Please share your photo with the office.'
				} : {
					type: 'success',
					message: 'Registration successful!'
				});
				resetForm();
			} else {
				// Show only the detail message
				let errorMessage = 'Registration failed. Please try again.';

				try {
					const errorData = await response.json();
					console.log('Full API Error Response:', errorData);

					// Extract the detail message if it exists
					if (errorData.detail) {
						errorMessage = typeof errorData.detail === 'string'
							? errorData.detail
							: JSON.stringify(errorData.detail);
					} else if (errorData.message) {
						errorMessage = errorData.message;
					} else if (errorData.error) {
						errorMessage = errorData.error;
					} else {
						// If none of the common error fields exist, show the full response
						errorMessage = JSON.stringify(errorData);
					}
				} catch (parseError) {
					errorMessage = `HTTP ${response.status}: ${response.statusText}`;
				}

				setNotification({
					type: 'danger',
					message: errorMessage
				});
			}
		} catch (error) {
			console.error('API Error:', error);
			setNotification({
				type: 'danger',
				message: `Network error occurred: ${error.message}`
			});
		} finally {
			setSubmitting(false);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	const upperStyle = { textTransform: 'uppercase' };

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
									placeholder="ENTER NAME AS PER AADHAAR CARD"
									style={upperStyle}
									className={`form-control ${errors.name ? 'is-invalid' : ''}`}
									required
								/>
								{errors.name
									? <div className="invalid-feedback">{errors.name}</div>
									: <div className="form-text">ENTER NAME AS PER AADHAAR CARD</div>}
							</div>
							<div className="col-md-6 mb-3">
								<label className="form-label">Phone *</label>
								<input
									type="text"
									name="phone"
									inputMode="numeric"
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
								<label className="form-label">WhatsApp Number</label>
								<input
									type="text"
									name="whatsapp"
									inputMode="numeric"
									value={formData.whatsapp}
									onChange={handleChange}
									className={`form-control ${errors.whatsapp ? 'is-invalid' : ''}`}
								/>
								{errors.whatsapp && <div className="invalid-feedback">{errors.whatsapp}</div>}
								{formData.phone.length === 13 && formData.whatsapp !== formData.phone && (
									<button
										type="button"
										className="btn btn-link btn-sm p-0"
										onClick={() => setFormData(prev => ({ ...prev, whatsapp: prev.phone }))}
									>
										Same as phone
									</button>
								)}
							</div>
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
						</div>

						<div className="row">
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

						{/* Joining Information */}
						<div className="row">
							<div className="col-md-6 mb-3">
								<label className="form-label">Institution Joining</label>
								<select
									name="institution_id"
									value={formData.institution_id}
									onChange={handleChange}
									className="form-select"
								>
									<option value="">Select Institution</option>
									{institutions.map(inst => (
										<option key={inst.id} value={inst.id}>{inst.name}</option>
									))}
								</select>
							</div>
							<div className="col-md-6 mb-3">
								<label className="form-label">Appointment Date</label>
								<input
									type="date"
									name="appointment_date"
									value={formData.appointment_date}
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
									style={upperStyle}
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
									style={upperStyle}
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
									style={upperStyle}
									className="form-control"
								/>
							</div>

							<div className="col-md-6 mb-3">
								<label className="form-label">Pincode</label>
								<input
									type="text"
									name="pincode"
									inputMode="numeric"
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
									style={upperStyle}
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
									style={upperStyle}
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
									style={upperStyle}
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
									style={upperStyle}
									className="form-control"
								/>
							</div>
						</div>

						<div className="row">
							<div className="col-md-6 mb-3">
								<label className="form-label">Married?</label>
								<select
									name="marital_status"
									value={formData.marital_status}
									onChange={handleChange}
									className="form-select"
								>
									<option value="">Select</option>
									<option value="yes">YES</option>
									<option value="no">NO</option>
								</select>
							</div>

							{formData.marital_status === 'yes' && (
								<div className="col-md-6 mb-3">
									<label className="form-label">Spouse's Name</label>
									<input
										type="text"
										name="spouse_name"
										value={formData.spouse_name}
										onChange={handleChange}
										style={upperStyle}
										className="form-control"
									/>
								</div>
							)}
						</div>

						{/* Additional Information */}
						<div className="row">
							<div className="col-md-6 mb-3">
								<label className="form-label">Aadhaar Number</label>
								<input
									type="text"
									name="aadhaar"
									inputMode="numeric"
									value={formData.aadhaar}
									onChange={handleChange}
									className={`form-control ${errors.aadhaar ? 'is-invalid' : ''}`}
								/>
								{errors.aadhaar && <div className="invalid-feedback">{errors.aadhaar}</div>}
							</div>

							<div className="col-md-6 mb-3">
								<label className="form-label">Photo</label>
								<input
									type="file"
									name="photo"
									accept="image/jpeg,image/png"
									ref={photoInputRef}
									onChange={handlePhotoChange}
									className={`form-control ${errors.photo ? 'is-invalid' : ''}`}
								/>
								{errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
								{photoPreview && (
									<img
										src={photoPreview}
										alt="Selected"
										className="mt-2 rounded"
										style={{ width: 96, height: 120, objectFit: 'cover' }}
									/>
								)}
							</div>
						</div>

						<div className="d-flex justify-content-end gap-2">
							<button
								type="button"
								onClick={resetForm}
								className="btn btn-secondary"
								disabled={submitting}
							>
								Clear Fields
							</button>
							<button type="submit" className="btn btn-submit" disabled={submitting}>
								{submitting ? 'Submitting…' : 'Submit'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default RegistrationForm;
