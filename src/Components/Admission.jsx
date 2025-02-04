import React, { useState, useEffect } from 'react';
import logo from '../Assets/logo.svg'

const AdmissionForm = () => {
	const [selectedInstitution, setSelectedInstitution] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({});
	const [formFields, setFormFields] = useState([]);
	const [institutions, setInstitutions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [standards, setStandards] = useState([]);
	const [selectedStandard, setSelectedStandard] = useState('');

	useEffect(() => {
		const fetchInstitutions = async () => {
			try {
				const response = await fetch('https://06fa-117-242-79-139.ngrok-free.app/api/v1/erp/admission/admission-open/institutions');
				const result = await response.json();
				if (result.status === 200) {
					setInstitutions(result.data);
				}
			} catch (error) {
				console.error("Error fetching institutions:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchInstitutions();
	}, []);

	const handleStandards = async (institution_id) => {
		try {
			const response = await fetch(`https://api.sirajulhuda.com/api/v1/erp/school/standards/list/${institution_id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});
			const result = await response.json();
			setStandards(result.data);
		} catch (error) {
			console.error("Error fetching standards:", error);
			alert("Something went wrong. Please try again.");
		}
	};

	const handleInstitutionSelect = async (e) => {
		const selectedValue = e.target.value;
		if (selectedValue) {
			setSelectedInstitution(selectedValue);
			try {
				const response = await fetch(`https://api.sirajulhuda.com/api/v1/erp/admission-application-config/${selectedValue}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					},
				});

				const res = await response.json();
				const institutionFormDetails = res.data;
				const institutionFormConfigs = institutionFormDetails.config;

				const fieldTypes = {
					str: 'text',
					standard: 'text',
					school: 'text',
					ration_card_type: 'text',
					yes_no: 'select',
					local_body: 'text',
					int: 'number',
					date: 'date'
				};

				const numberFields = [
					'mobile',
					'whats_app',
					'aadhaar',
					'phone',
					'father_phone',
					'mother_phone',
					'pin_code'
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
						if (field.isYesNo) {
							initialFormData[field.name] = field.defaultValue ? "yes" : "no";
						} else {
							initialFormData[field.name] = field.defaultValue;
						}
					}
				});
				await handleStandards(selectedValue);
				setFormData(initialFormData);
			} catch (error) {
				console.error("Error fetching form config:", error);
				alert("Something went wrong. Please try again.");
			}
		}
		setShowForm(true);
	};

	const handleBack = () => {
		setShowForm(false);
		setSelectedInstitution('');
		setFormData({});
		setSelectedStandard('');
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const submissionData = {
			institution_id: selectedInstitution,
			standard: selectedStandard,
			...formData
		};

		try {
			console.log(typeof submissionData.institution_id);

			const url = 'https://web-dev-2c5e.up.railway.app/api/v1/erp/admission/application/create';
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					// 'id': null,
					// 'year_id': null,

					'institution_id': submissionData.institution_id === null ? null : Number(submissionData.institution_id),
					'standard_id': submissionData.standard === null ? null : Number(submissionData.standard),

					// 'sem_id': submissionData.sem_id === null ? null : submissionData.sem_id,
					// 'batch_id': submissionData.batch_id === null ? null : submissionData.batch_id,
					// 'course_id': submissionData.course_id === null ? null : submissionData.course_id,
					// 'type': submissionData.type === null ? null : submissionData.type,
					// 'fb_id': submissionData.fb_id === null ? null : submissionData.fb_id,
					// 'applied_at': submissionData.applied_at === null ? null : submissionData.applied_at, 
					// 'updated_at': submissionData.updated_at === null ? null : submissionData.updated_at,
					'mobile': submissionData.mobile,
					'whats_app': submissionData.whats_app === null ? null : submissionData.whats_app,
					'email': submissionData.email === null ? null : submissionData.email,
					'name': submissionData.name === null ? null : submissionData.name,
					'full_initial': submissionData.full_initial === null ? null : submissionData.full_initial,
					// 'dob': submissionData.dob === null ? null : submissionData.dob,
					'dob': submissionData.dob ? new Date(submissionData.dob).toISOString().slice(0, 19).replace('T', ' ') : null,
					// 'dob':	null ,
					'word_dob': submissionData.word_dob === null ? null : submissionData.word_dob,
					'gender': submissionData.gender === null ? null : submissionData.gender,
					'blood_group': submissionData.blood_group === null ? null : submissionData.blood_group,
					'religion': submissionData.religion === null ? null : submissionData.religion,
					'caste': submissionData.caste === null ? null : submissionData.caste,
					'aadhaar': submissionData.aadhaar === null ? null : submissionData.aadhaar,
					'mother_tongue': submissionData.mother_tongue === null ? null : submissionData.mother_tongue,
					'house_name': submissionData.house_name === null ? null : submissionData.house_name,
					'local_name': submissionData.local_name === null ? null : submissionData.local_name,
					'local_body': submissionData.local_body === null ? null : submissionData.local_body,
					'ration_card_type': submissionData.ration_card_type === null ? null : submissionData.ration_card_type,
					'pin_code': submissionData.pin_code === null ? null : submissionData.pin_code,
					'post': submissionData.post === null ? null : submissionData.post,
					'place': submissionData.place === null ? null : submissionData.place,
					'block': submissionData.block === null ? null : submissionData.block,
					'taluk': submissionData.taluk === null ? null : submissionData.taluk,
					'district': submissionData.district === null ? null : submissionData.district,
					'state': submissionData.state === null ? null : submissionData.state,
					'nationality': submissionData.nationality === null ? null : submissionData.nationality,
					// 'vaccination_date': submissionData.vaccination_date === null ? null : submissionData.vaccination_date,
					// 'is_single_girl': submissionData.is_single_girl === null ? null : submissionData.is_single_girl,
					'is_single_girl': true ,
					'is_disabled': submissionData.is_disabled === null ? null : submissionData.is_disabled,
					'father_name': submissionData.father_name === null ? null : submissionData.father_name,
					'father_phone': submissionData.father_phone === null ? null : submissionData.father_phone,
					'father_income': submissionData.father_income === null ? null : submissionData.father_income,
					'father_email': submissionData.father_email === null ? null : submissionData.father_email,
					'father_qualification': submissionData.father_qualification === null ? null : submissionData.father_qualification,
					'father_occupation': submissionData.father_occupation === null ? null : submissionData.father_occupation,
					'mother_name': submissionData.mother_name === null ? null : submissionData.mother_name,
					'mother_occupation': submissionData.mother_occupation === null ? null : submissionData.mother_occupation,
					'mother_email': submissionData.mother_email === null ? null : submissionData.mother_email,
					'mother_phone': submissionData.mother_phone === null ? null : submissionData.mother_phone,
					'mother_qualification': submissionData.mother_qualification === null ? null : submissionData.mother_qualification,
					'mother_income': submissionData.mother_income === null ? null : submissionData.mother_income,
					'guardian': submissionData.guardian === null ? null : submissionData.guardian,
					'relationship': submissionData.relationship === null ? null : submissionData.relationship,
					'guardian_address': submissionData.guardian_address === null ? null : submissionData.guardian_address,
					// 'fb_year_id': submissionData.fb_year_id === null ? null : submissionData.fb_year_id,
					// 'fb_school_id': submissionData.fb_school_id === null ? null : submissionData.fb_school_id,
					// 'fb_cls_id': submissionData.fb_cls_id === null ? null : submissionData.fb_cls_id,

					'last_school': submissionData.last_school === null ? null : submissionData.last_school,
					'last_school_affiliation': submissionData.last_school_affiliation === null ? null : submissionData.last_school_affiliation,
					'tc_no': submissionData.tc_no === null ? null : submissionData.tc_no,
					'tc_issue_date': submissionData.tc_issue_date === null ? null : submissionData.tc_issue_date,
					// 'last_result': submissionData.last_result === null ? null : submissionData.last_result,
					'id_mark': submissionData.id_mark === null ? null : submissionData.id_mark,
					// 'birth_url': submissionData.birth_url === null ? null : submissionData.birth_url,
					// 'ration_url': submissionData.ration_url === null ? null : submissionData.ration_url,
					// 'aadhaar_url': submissionData.aadhaar_url === null ? null : submissionData.aadhaar_url,
					// 'ml_name': submissionData.ml_name === null ? null : submissionData.ml_name,
					// 'applied_by': submissionData.applied_by === null ? null : submissionData.applied_by,
					// 'img_url': submissionData.img_url === null ? null : submissionData.img_url,
					// 'panchayat': submissionData.panchayat === null ? null : submissionData.panchayat,
					'father_job_title': submissionData.father_job_title === null ? null : submissionData.father_job_title,
				
				
		

				}),
			});

			console.log('Form submitted with the following data:', submissionData);
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};




	return (
		<div className="admission-page">
			<div className="form-container">
				<div className="form-wrapper">
					<div className="form-card">
						<img src={logo} className='logo-img' alt="" />
						<h2 className="form-title">Application for Admission</h2>

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
								)}
							</div>
						) : (
							<form onSubmit={handleSubmit} className="admission-form">
								<div className="form-header">
									<button type="button" onClick={handleBack} className="back-button">
										← Back
									</button>
									<p className="selected-institution">
										Institution: {institutions.find(i => i.id === Number(selectedInstitution))?.name}
									</p>
								</div>

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

								<div className="form-fields">
									{formFields.length === 0 ? (
										<p className="no-fields">Loading...</p>
									) : (
										formFields.map((field) => (
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
										))
									)}
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




















// id: Optional[int] = None  
// year_id: Optional[int] = None  
// institution_id: Optional[int] = None  
// standard_id: Optional[int] = None  
// sem_id: Optional[int] = None  
// batch_id: Optional[int] = None  
// course_id: Optional[int] = None  
// type: Optional[str] = None  
// fb_id: Optional[str] = None  
// applied_at: Optional[str] = None  
// updated_at: Optional[str] = None  
// mobile: Optional[str] = None  
// whats_app: Optional[str] = None  
// email: Optional[str] = None  
// name: Optional[str] = None  
// full_initial: Optional[str] = None  
// dob: Optional[datetime] = None  
// word_dob: Optional[str] = None  
// gender: Optional[str] = None  
// blood_group: Optional[str] = None  
// religion: Optional[str] = None  
// caste: Optional[str] = None  
// aadhaar: Optional[str] = None  
// mother_tongue: Optional[str] = None  
// house_name: Optional[str] = None  
// local_name: Optional[str] = None  
// local_body: Optional[str] = None  
// ration_card_type: Optional[str] = None  
// pin_code: Optional[str] = None  
// post: Optional[str] = None  
// place: Optional[str] = None  
// block: Optional[str] = None  
// taluk: Optional[str] = None  
// district: Optional[str] = None  
// state: Optional[str] = None  
// nationality: Optional[str] = None  
// vaccination_date: Optional[datetime] = None  
// is_single_girl: Optional[bool] = None  
// is_disabled: Optional[bool] = None  
// father_name: Optional[str] = None  
// father_phone: Optional[str] = None  
// father_income: Optional[str] = None  
// father_email: Optional[str] = None  
// father_qualification: Optional[str] = None  
// father_occupation: Optional[str] = None  
// mother_name: Optional[str] = None  
// mother_occupation: Optional[str] = None  
// mother_email: Optional[str] = None  
// mother_phone: Optional[str] = None  
// mother_qualification: Optional[str] = None  
// mother_income: Optional[str] = None  
// guardian: Optional[str] = None  
// relationship: Optional[str] = None  
// guardian_address: Optional[str] = None  
// fb_year_id: Optional[str] = None  
// fb_school_id: Optional[str] = None  
// fb_cls_id: Optional[str] = None  
// last_school: Optional[str] = None  
// last_school_affiliation: Optional[str] = None  
// tc_no: Optional[str] = None  
// tc_issue_date: Optional[str] = None  
// last_result: Optional[str] = None  
// id_mark: Optional[str] = None  
// birth_url: Optional[str] = None  
// ration_url: Optional[str] = None  
// aadhaar_url: Optional[str] = None  
// ml_name: Optional[str] = None  
// applied_by: Optional[str] = None  
// img_url: Optional[str] = None  
// panchayat: Optional[str] = None  
// father_job_title: Optional[str] = None  
// father_job_country: Optional[str] = None  
// moral_education: Optional[str] = None  
// academic_education: Optional[str] = None  
// nominee_1: Optional[str] = None  
// nominee_2: Optional[str] = None  
// has_chronic: Optional[str] = None  
// created_at: Optional[datetime] = None  
// status: Optional[str] = None  
// cap_id: Optional[str] = None  
// married: Optional[bool] = None  
// mark: Optional[dict] = None  
// ssls_mark: Optional[dict] = None  
// plus_two_mark: Optional[dict] = None  
// degree_mark: Optional[dict] = None  
// test_mark: Optional[dict] = None  
// achievements: Optional[str] = None  
// ugc_college: Optional[str] = None  
// course_choice: Optional[str] = None  
// ielts_choice: Optional[str] = None  
// diploma_choice: Optional[str] = None  
// responsible_1: Optional[str] = None  
// responsible_2: Optional[str] = None  
