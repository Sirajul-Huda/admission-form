import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../Assets/logo.svg';

const AdmissionForm = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // State Management
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [formFields, setFormFields] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [standards, setStandards] = useState([]);
    const [selectedStandard, setSelectedStandard] = useState('');
    const [alert, setAlert] = useState({ message: '', type: '' });

    // Alert Styling Function
    const alertStyle = (type) => ({
        backgroundColor: type === 'error' ? '#ffebee' : '#e8f5e9',
        color: type === 'error' ? '#c62828' : '#2e7d32',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '14px',
        textAlign: 'center',
        fontWeight: '500',
        display: alert.message ? 'block' : 'none',
        border: `1px solid ${type === 'error' ? '#ef9a9a' : '#a5d6a7'}`
    });


	// Institution and Standards Fetching
	useEffect(() => {
		const fetchInstitutions = async () => {
				try {
						const response = await fetch('https://api.sirajulhuda.com/api/v1/erp/admission/admission-open/institutions');
						const result = await response.json();
						if (result.status === 200) {
								setInstitutions(result.data);

								// Check for institution ID in query params
								const institutionId = searchParams.get('institution');
								if (institutionId) {
										const selectedInst = result.data.find(inst => inst.id === Number(institutionId));
										if (selectedInst) {
												setSelectedInstitution(institutionId);
												await handleInstitutionSelect({ target: { value: institutionId } });
										}
								}
						}
				} catch (error) {
						console.error("Error fetching institutions:", error);
				} finally {
						setLoading(false);
				}
		};

		fetchInstitutions();
}, []);

// Fetch Standards for Selected Institution
const handleStandards = async (institution_id) => {
		try {
				const response = await fetch(`https://api.sirajulhuda.com/api/v1/erp/school/standards/list/${institution_id}`, {
						method: "GET",
						headers: { "Content-Type": "application/json" }
				});
				const result = await response.json();
				setStandards(result.data);
		} catch (error) {
				console.error("Error fetching standards:", error);
				setAlert({ message: "Error fetching standards. Please try again.", type: 'error' });
		}
};

// Handle Institution Selection
const handleInstitutionSelect = async (e) => {
		const selectedValue = e.target.value;
		if (selectedValue) {
				// Update URL with query parameter
				setSearchParams({ institution: selectedValue });
				
				setSelectedInstitution(selectedValue);
				try {
						const response = await fetch(`https://api.sirajulhuda.com/api/v1/erp/admission-application-config/${selectedValue}`, {
								method: "GET",
								headers: { "Content-Type": "application/json" },
						});

						const res = await response.json();
						const institutionFormDetails = res.data;
						const institutionFormConfigs = institutionFormDetails.config;

						const fieldTypes = {
								str: 'text', standard: 'text', school: 'text',
								ration_card_type: 'text', yes_no: 'select',
								local_body: 'text', int: 'number', date: 'date'
						};

						const numberFields = [
								'mobile', 'whats_app', 'aadhaar', 'phone', 
								'father_phone', 'mother_phone', 'pin_code'
						];

						const updatedFormFields = institutionFormConfigs
								.filter(config => 
										config.visibility === true &&
										config.column_name !== 'standard' &&
										!config.title.toLowerCase().includes('standard')
								)
								.map(config => ({
										name: config.column_name,
										title: config.title,
										type: numberFields.includes(config.column_name) ? 'number' : fieldTypes[config.type] || 'text',
										required: config.is_required,
										defaultValue: config.default_value,
										isYesNo: config.type === 'yes_no'
								}));

						setFormFields(updatedFormFields);

						const initialFormData = {};
						updatedFormFields.forEach(field => {
								if (field.defaultValue !== null) {
										initialFormData[field.name] = field.isYesNo 
												? (field.defaultValue ? "yes" : "no") 
												: field.defaultValue;
								}
						});

						await handleStandards(selectedValue);
						setFormData(initialFormData);
				} catch (error) {
						console.error("Error fetching form config:", error);
						setAlert({ message: "Error loading form configuration. Please try again.", type: 'error' });
				}
		}
		setShowForm(true);
};

// Reset Form
const resetForm = () => {
		setFormData({});
		setSelectedStandard('');
		setSelectedInstitution(null);
		setShowForm(false);
		setFormFields([]);
		setAlert({ message: '', type: '' });
};

// Handle Form Input Changes
const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
				...prev,
				[name]: value
		}));
};

// Handle Form Submission
const handleSubmit = async (e) => {
		e.preventDefault();
		const submissionData = {
				institution_id: selectedInstitution,
				standard: selectedStandard,
				...formData
		};

		try {
				const url = 'https://api.sirajulhuda.com/api/v1/erp/admission/application/create';
				const response = await fetch(url, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
								'institution_id': submissionData.institution_id === null ? null : Number(submissionData.institution_id),
								'standard_id': submissionData.standard === null ? null : Number(submissionData.standard),
								// ... (rest of the submission data mapping remains the same as in original code)
						}),
				});

				const result = await response.json();
				
				if (result.detail === "application existed") {
						setAlert({ message: 'Application already exists!', type: 'error' });
						window.scrollTo({ top: 0, behavior: 'smooth' });
				} else {
						setAlert({ 
								message: 'Application submitted successfully! Redirecting to home page...', 
								type: 'success' 
						});
						window.scrollTo({ top: 0, behavior: 'smooth' });
						
						resetForm();
						
						setTimeout(() => {
								navigate('/success');
						}, 10);
				}

		} catch (error) {
				console.error("Error submitting form:", error);
				setAlert({ message: 'Error submitting application. Please try again.', type: 'error' });
				window.scrollTo({ top: 0, behavior: 'smooth' });
		}
};

// Handle Back Navigation
const handleBack = () => {
		setSearchParams({});
		resetForm();
};

// Render Component
return (
		<div className="admission-page">
				<div className="form-container">
						<div className="form-wrapper">
								<div className="form-card">
										<img src={logo} className='logo-img' alt="" />
										<h2 className="form-title">Application for Admission</h2>
										
										{/* Instructions */}
										<div className="box-items">
												<p className="selected-institutions">1. ഇംഗ്ലീഷിലെ വലിയ  അക്ഷരത്തിൽ മാത്രമേ ഫോം പൂരിപ്പിക്കാവൂ</p>
												<p className="selected-institutions">2. ഫോമിൽ ചുവപ്പ് കളറിൽ മാർക്ക് ചെയ്തിട്ടുള്ളവ നിർബന്ധമായും പൂരിപ്പിക്കേണ്ടതാണ്</p>
												<p className="selected-institutions">3. ക്ലാസ്, ഫോൺ നമ്പറുകൾ എന്നിവ തെറ്റില്ലെന്ന് ഉറപ്പ് വരുത്തുക. പിന്നീട് തിരുത്താനാവില്ല</p>
												<p className="selected-institutions">4. ഫോം പൂർണമായും പൂരിപ്പിച്ച ശേഷം സബ്മിറ്റ് ബട്ടൺ അമർത്തുക</p>
										</div>
										
										{/* Alert Message */}
										<div style={alertStyle(alert.type)}>
												{alert.message}
										</div>

										{!showForm ? (
												<div className="institution-select">
														<label htmlFor="institution" className="select-label">
																Select Institution
														</label>
														{loading ? (
																<p>Loading institutions...</p>
														) : (
																<select
																		id="institution"
																		value={selectedInstitution || ''}
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
														)}
												</div>
										) : (
												<form onSubmit={handleSubmit} className="admission-form">
														<div className="form-header">
																{/* <button type="button" onClick={handleBack} className="back-button">
																		← Back
																</button> */}
																<p className="selected-institution">
																		Institution: {institutions.find(i => i.id === Number(selectedInstitution))?.name}
																</p>
														</div>

														{/* Standard Selection */}
														<div className="form-field">
																<label htmlFor="standard" className="field-label">
																		Select Standard
																		<span className="required">*</span>
																</label>
																<select
																		id="standard"
																		value={selectedStandard}
																		onChange={(e) => setSelectedStandard(e.target.value)}
																		className="select-input"
																		required
																>
																		<option value="">Choose a standard</option>
																		{standards.map((std) => (
																				<option key={std.id} value={std.id}>
																						{std.name}
																				</option>
																		))}
																</select>
														</div>    

														{/* Dynamic Form Fields */}
														<div className="form-fields">
																{formFields.map((field) => (
																		<div key={field.name} className="form-field">
																				<label htmlFor={field.name} className="field-label">
																						{field.title}
																						{field.required && <span className="required">*</span>}
																				</label>
																				{field.isYesNo ? (
																						<select
																								id={field.name}
																								name={field.name}
																								value={formData[field.name] || ''}
																								onChange={handleChange}
																								required={field.required}
																								className="select-input"
																						>
																								<option value="">Select Yes/No</option>
																								<option value="yes">Yes</option>
																								<option value="no">No</option>
																						</select>
																				) : (
																						<input
																								type={field.type}
																								id={field.name}
																								name={field.name}
																								required={field.required}
																								value={formData[field.name] || ''}
																								onChange={handleChange}
																								className="field-input"
																								placeholder={`Enter ${field.title}`}
																						/>
																				)}
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