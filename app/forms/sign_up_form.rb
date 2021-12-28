class SignUpForm
  include ActiveModel::Model
  include ActiveModel::Validations

  attr_accessor :first_name, :last_name, :email, :company, :new_password, :new_password_confirmation, :account, :user

  validates_presence_of :first_name, :last_name, :email, :company, :new_password, :new_password_confirmation
  validates :new_password, not_pwned: true
  validates_length_of :new_password, minimum: 6
  validate :validate_children

  def initialize(*)
    super
  end

  def submit(registration_params)
    build_children(registration_params)

    result = nil
    if valid?
      result = SignUp.call(account, user).result
    end
    result
  end

  def build_children(registration_params)
    self.first_name = registration_params[:first_name]
    self.last_name = registration_params[:last_name]
    self.email = registration_params[:email]
    self.new_password = registration_params[:new_password]
    self.new_password_confirmation = registration_params[:new_password_confirmation]
    self.company = registration_params[:company]

    @user = User.new(first_name: first_name,
                     last_name: last_name,
                     email: email,
                     password: new_password,
                     password_confirmation: new_password_confirmation)
    @account = Account.new(name: company)
  end

  def validate_children
    promote_errors(user) if user.invalid?

    promote_errors(account) if account.invalid?
  end

  def promote_errors(child)
    child.errors.each do |error|
      errors.errors.append(error) if error.attribute == :email and email_error_non_exisisting?
    end
  end

  def email_error_non_exisisting?
    errors.errors.each do |error|
      return false if error.attribute == :email
    end
    true
  end

  def persisted?
    false
  end
end
