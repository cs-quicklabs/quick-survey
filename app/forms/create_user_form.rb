class CreateUserForm
  include ActiveModel::Model
  include ActiveModel::Validations

  attr_accessor :first_name, :last_name, :email, :discipline, :job, :role, :manager, :account, :actor

  validates_presence_of :first_name, :last_name, :email, :discipline, :job, :role, :manager

  def initialize(account, actor)
    @account = account
    @actor = actor
  end

  def submit(params, invite)
    self.first_name = params[:first_name]
    self.last_name = params[:last_name]
    self.email = params[:email]
    self.discipline = params[:discipline_id]
    self.job = params[:job_id]
    self.role = params[:role_id]
    self.manager = params[:manager_id]

    if valid?
      CreateUser.call(params, actor, account, invite).result
    else
      false
    end
  end

  def persisted?
    false
  end
end
