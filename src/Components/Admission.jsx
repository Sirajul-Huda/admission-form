import React, { useState } from 'react';

const AdmissionForm = () => {
	const [selectedInstitution, setSelectedInstitution] = useState('');
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({});

	const institutions = [
		{ id: 31, name: "School of Tahfizul Quran" },
		{ id: 32, name: "Sample Institution 2" },
		{ id: 33, name: "Sample Institution 3" }
	];

	const formFields = [
		{ name: 'mobile', title: 'Mobile', type: 'text', required: true },
		{ name: 'name', title: 'Full Name', type: 'text', required: true },
		{ name: 'email', title: 'Email', type: 'email', required: true },
		{ name: 'dob', title: 'Date of Birth', type: 'date', required: true },
		{ name: 'house_name', title: 'House Name', type: 'text', required: true },
		{ name: 'post', title: 'Post', type: 'text', required: true },
		{ name: 'pin_code', title: 'PIN Code', type: 'text', required: true },
		{ name: 'panchayat', title: 'Panchayat', type: 'text', required: true },
		{ name: 'mother_name', title: "Mother's Name", type: 'text', required: true },
		{ name: 'aadhaar', title: 'Aadhaar Number', type: 'text', required: false },
		{ name: 'guardian', title: 'Guardian Name', type: 'text', required: false },
		{ name: 'relationship', title: 'Relationship with Guardian', type: 'text', required: false },
		{ name: 'father_occupation', title: 'Job Title', type: 'text', required: false },
		{ name: 'father_income', title: 'Annual Income', type: 'text', required: false },
		{ name: 'father_job_country', title: 'Country of Job', type: 'text', required: false },
		{ name: 'last_school', title: 'Last School', type: 'text', required: false },
		{ name: 'moral_education', title: 'Last Madrassa', type: 'text', required: false },
		{ name: 'id_mark', title: 'Identification Mark', type: 'text', required: false }
	];

	const handleInstitutionSelect = (e) => {
		setSelectedInstitution(e.target.value);
		setShowForm(true);
	};

	const handleBack = () => {
		setShowForm(false);
		setSelectedInstitution('');
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Form submitted:', { institution: selectedInstitution, ...formData });
	};

	return (
		<div className="admission-page">
			<div className="form-container">
				<div className="form-wrapper">
					<div className="form-card">
						<h2 className="form-title">Application for Admission</h2>

						{!showForm ? (
							<div className="institution-select">
								<label htmlFor="institution" className="select-label">
									Select Institution
								</label>
								<select
									id="institution"
									value={selectedInstitution}
									onChange={handleInstitutionSelect}
									className="select-input"
								>
									<option value="">Choose an institution</option>
									{institutions.map((inst) => (
										<option key={inst.id} value={String(inst.id)}>
											{inst.name}
										</option>
									))}
								</select>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="admission-form">
								<div className="form-header">
									<button
										type="button"
										onClick={handleBack}
										className="back-button"
									>
										← Back
									</button>
									<p className="selected-institution">
										Selected: {institutions.find(i => i.id === Number(selectedInstitution))?.name}
									</p>
								</div>

								<div className="form-fields">
									{formFields.map((field) => (
										<div key={field.name} className="form-field">
											<label htmlFor={field.name} className="field-label">
												{field.title}
												{field.required && <span className="required">*</span>}
											</label>
											<input
												type={field.type}
												id={field.name}
												name={field.name}
												required={field.required}
												placeholder={`Enter ${field.title}`}
												value={formData[field.name] || ''}
												onChange={handleChange}
												className="field-input"
											/>
										</div>
									))}
								</div>

								<button type="submit" className="submit-button">
									Submit Application →
								</button>
							</form>
						)}
					</div>
				</div>
				
			</div>
		</div>

	);
};

export default AdmissionForm;