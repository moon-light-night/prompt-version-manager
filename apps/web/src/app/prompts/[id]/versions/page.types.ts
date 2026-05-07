export interface VersionHistoryPageProps {
  params: { id: string };
}

export interface VersionComparePageProps {
  params: { id: string };
}

export interface VersionDetailPageProps {
  params: { id: string; versionId: string };
}
