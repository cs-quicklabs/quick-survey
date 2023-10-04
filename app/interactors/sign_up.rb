class SignUp < Patterns::Service
  def initialize(account, user)
    @account = account
    @user = user
  end

  def call
    begin
      register
    rescue
      user
    end
    user
  end

  private

  def register
    ActiveRecord::Base.transaction do
      create_account
      create_user
    end
  end

  def create_account
    account.save!
  end

  def seed_database
    now = Time.now
    ActsAsTenant.with_tenant(account) do
      Discipline.create!([{ name: "Management" }, { name: "Design" }, { name: "HR" }, { name: "Development" }, { name: "Admin" }])
      Job.create!([{ name: "Admin" }, { name: "UI/UX Designer" }, { name: "Android Developer" }, { name: "Web Developer" }, { name: "HR Executive" }])
      Role.create!([{ name: "Super" }, { name: "Senior" }, { name: "Junior" }])
    end
  end

  def create_user
    ActsAsTenant.with_tenant(account) do
      user.account = account
      user.role = 1
      user.save!
    end

    def update_account_with_owner
      ActsAsTenant.with_tenant(account) do
        account.owner_id = user.id
        account.save!
      end
    end

    def seed_preferences
      ActsAsTenant.with_tenant(account) do
        Preference.new(key: "delete_deactivated_users_after_x_days", value: "1095", title: "Delete deactivated users after a specified time", message: "You can destroy old deactivated users automatically after a certain time. Please select time after which deactivated users can be deleted ").save
        Preference.new(key: "delete_timesheets_after_x_days", value: "90", title: "Delete timesheets after a specific time duration", message: "The timesheets recorded will be deleted after below specified time. This helps to keep only those records which are needed. Please select time after which old timesheets can be deleted").save
        Preference.new(key: "delete_archived_projects_after_x_days", value: "365", title: "Delete archived projects after a specified time", message: "You can destroy old archived projects automatically after a certain time. Please select time after which archived projects can be deleted ").save
        Preference.new(key: "consider_overall_kpi_score", value: "true", title: "Consider overall KPI score when KPIs are changed", message: "When KPIs are changed for an employee, do you wish to consider previous KPIs in overall score or just the new KPIs score should be considered while calculating final score").save
        Preference.new(key: "transfer_data_to_admin", value: User.where(account: account, permission: :admin).first.id, title: "Transfer data to admin on user delete", message: "When a user is deleted, you might want to keep some of the data like nuggets, Knowledge Base or Report Templates. Whom do you wish to assign this data when the user is deleted").save
      end
    end

    def seed_ticket_labels
      ActsAsTenant.with_tenant(account) do
        TicketLabel.new(name: "Other", user: user, discipline: Discipline.find_by_name("Admin")).save
      end
    end

    def set_stripe_subscription_trial
      time = 14.days.from_now
      user.set_payment_processor :fake_processor, allow_fake: true
      user.payment_processor.subscribe(trial_ends_at: time, ends_at: time)
    end
  end

  attr_reader :account, :user
end
