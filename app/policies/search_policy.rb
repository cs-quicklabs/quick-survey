class SearchPolicy < Struct.new(:user, :search)
  def surveys?
    true
  end

  def spaces_surveys_and_folders?
    true
  end

  def archived_surveys?
    true
  end

  def archived_users?
    true
  end
end
