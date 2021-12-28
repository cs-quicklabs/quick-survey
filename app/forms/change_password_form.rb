class ChangePasswordForm
  include ActiveModel::Model

  # Add all validations you need
  validates_presence_of :original_password, :new_password, :new_password_confirmation
  validates_confirmation_of :new_password
  validate :verify_old_password
  validates :new_password, not_pwned: true
  validates_length_of :new_password, minimum: 6

  attr_accessor :original_password, :new_password, :new_password_confirmation

  def initialize(user)
    @user = user
  end

  def submit(params)
    self.original_password = params[:original_password]
    self.new_password = params[:new_password]
    self.new_password_confirmation = params[:new_password_confirmation]

    if valid?
      @user.password = new_password
      @user.password_confirmation = new_password
      @user.save!
      true
    else
      false
    end
  end

  def verify_old_password
    unless @user.valid_password?(original_password)
      errors.add :original_password, "is not correct"
    end
  end

  # This method is required
  def persisted?
    false
  end
end
